import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { createClient } from "../server";
import { SupabaseClient } from "@supabase/supabase-js";

// Helper function to get Supabase storage client with authentication check
async function getStorage(): Promise<SupabaseClient["storage"]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User is not authenticated");
    }
    const storage = supabase.storage;
    return storage;
  } catch (error) {
    throw new Error(`Failed to initialize storage client: ${error}`);
  }
}

type UploadFile = {
  file: File;
  bucket: string;
  folder: string;
};

type UploadResult = {
  imageUrl: string;
  error: string;
};

// Upload and compress an image to Supabase storage
export async function uploadImage({
  file,
  bucket,
  folder,
}: UploadFile): Promise<UploadResult> {
  if (!(file instanceof File)) {
    return { imageUrl: "", error: "Invalid file object" };
  }

  const fileName = file.name;
  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${uuidv4()}.${fileExtension}`;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { imageUrl: "", error: "Supabase URL is not configured" };
  }

  try {
    const storage = await getStorage();

    let fileToUpload: File | Buffer = file;
    try {
      // Convert File to Buffer for Sharp
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Compress and resize image using Sharp
      const compressedBuffer = await sharp(buffer)
        .resize({
          width: 1920,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .png({ compressionLevel: 9 })
        .toBuffer();

      // Create a new File object from the compressed buffer
      fileToUpload = new File([compressedBuffer], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
    } catch (compressionError) {
      console.warn(
        "Image compression failed, uploading original file:",
        compressionError
      );
    }

    const { data, error } = await storage
      .from(bucket)
      .upload(path, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      if (error.message.includes("row-level security")) {
        return {
          imageUrl: "",
          error: "Upload failed due to storage bucket permissions (RLS policy)",
        };
      }
      return { imageUrl: "", error: `Image upload failed: ${error.message}` };
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;
    return { imageUrl, error: "" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { imageUrl: "", error: `Error processing image: ${errorMessage}` };
  }
}

// Delete an image from Supabase storage
export async function deleteImage(
  imageUrl: string
): Promise<{ data: any; error: string }> {
  if (!imageUrl || !imageUrl.includes("/storage/v1/object/public/")) {
    return { data: null, error: "Invalid image URL" };
  }

  try {
    const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
    const firstSlashIndex = bucketAndPathString.indexOf("/");

    if (firstSlashIndex === -1) {
      return { data: null, error: "Invalid image URL format" };
    }

    const bucket = bucketAndPathString.slice(0, firstSlashIndex);
    const path = bucketAndPathString.slice(firstSlashIndex + 1);

    const storage = await getStorage();
    const { data, error } = await storage.from(bucket).remove([path]);

    if (error) {
      if (error.message.includes("row-level security")) {
        return {
          data: null,
          error:
            "Deletion failed due to storage bucket permissions (RLS policy)",
        };
      }
      return { data: null, error: `Failed to delete image: ${error.message}` };
    }

    return { data, error: "" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { data: null, error: `Error deleting image: ${errorMessage}` };
  }
}

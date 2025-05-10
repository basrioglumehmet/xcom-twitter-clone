"use server";

import { createClient } from "@/utils/supabase/server";
import {
  fetchUserPosts,
  insertPost,
  insertReply,
  insertRepost,
  validateParentPost,
} from "./db/postDb";
import {
  validatePostFormData,
  validateReplyOrRepostFormData,
} from "./validation/validation";

import { uploadImage } from "@/utils/supabase/storage/client";

export async function uploadPostImage(imageData: File): Promise<string | null> {
  const result = await uploadImage({
    file: imageData,
    bucket: "posts",
    folder: "images",
  });

  if (result.error) {
    throw new Error(`Failed to upload image: ${result.error}`);
  }

  return result.imageUrl;
}

export async function fetchUserPostsAction(profileId: string) {
  try {
    const supabase = await createClient();
    const posts = await fetchUserPosts(supabase, profileId);
    return { success: true, data: posts };
  } catch (error) {
    console.error("Unexpected error fetching user posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch posts",
    };
  }
}

export async function createNewPostAction(formData: FormData) {
  try {
    const { text, contentType, imageData, geoLat, geoLong, profileId } =
      validatePostFormData(formData);
    const supabase = await createClient();

    const imageUrl =
      imageData instanceof File ? await uploadPostImage(imageData) : null;

    await insertPost(supabase, {
      imageUrl,
      text,
      contentType,
      geoLat,
      geoLong,
      profileId,
    });

    return { success: true, message: "Post created successfully" };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}

export async function postReplyAction(formData: FormData) {
  try {
    const {
      text,
      contentType,
      imageData,
      geoLat,
      geoLong,
      profileId,
      parentPostId,
    } = validateReplyOrRepostFormData(formData);
    const supabase = await createClient();

    await validateParentPost(supabase, parentPostId);
    const imageUrl =
      imageData instanceof File ? await uploadPostImage(imageData) : null;

    const postId = await insertPost(supabase, {
      imageUrl,
      text,
      contentType,
      geoLat,
      geoLong,
      profileId,
    });

    await insertReply(supabase, {
      parent_post_id: parentPostId,
      reply_post_id: postId,
    });

    return { success: true, message: "Reply created successfully" };
  } catch (error) {
    console.error("Error creating reply:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create reply",
    };
  }
}

export async function insertRepostAction(formData: FormData) {
  try {
    const {
      text,
      contentType,
      imageData,
      geoLat,
      geoLong,
      profileId,
      parentPostId,
    } = validateReplyOrRepostFormData(formData);
    const supabase = await createClient();

    await validateParentPost(supabase, parentPostId);
    const imageUrl =
      imageData instanceof File ? await uploadPostImage(imageData) : null;

    const postId = await insertPost(supabase, {
      imageUrl,
      text,
      contentType,
      geoLat,
      geoLong,
      profileId,
    });

    await insertRepost(supabase, {
      parent_post_id: parentPostId,
      repost_id: postId,
    });

    return { success: true, message: "Repost created successfully" };
  } catch (error) {
    console.error("Error creating repost:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create repost",
    };
  }
}

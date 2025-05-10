import { ContentType } from "@/model/postModel";

export function validatePostFormData(formData: FormData) {
  const text = formData.get("text") as string;
  const contentType = formData.get("contentType") as ContentType;
  const imageData = formData.get("image");
  const geoLatRaw = formData.get("geo_lat");
  const geoLongRaw = formData.get("geo_long");
  const profileIdRaw = formData.get("profile_id") as string;

  if (!text || typeof text !== "string") {
    throw new Error("Text content is required");
  }
  if (!contentType) {
    throw new Error("Content type is required");
  }
  if (!profileIdRaw || typeof profileIdRaw !== "string") {
    throw new Error("Profile ID is required");
  }
  if (imageData && !(imageData instanceof File)) {
    throw new Error("Invalid image file");
  }

  const profileId = parseInt(profileIdRaw);
  if (isNaN(profileId)) {
    throw new Error("Invalid profile ID");
  }

  const geoLat = geoLatRaw ? parseFloat(geoLatRaw as string) : null;
  const geoLong = geoLongRaw ? parseFloat(geoLongRaw as string) : null;
  if (
    (geoLat !== null && isNaN(geoLat)) ||
    (geoLong !== null && isNaN(geoLong))
  ) {
    throw new Error("Invalid geo coordinates");
  }

  return { text, contentType, imageData, geoLat, geoLong, profileId };
}

export function validateReplyOrRepostFormData(formData: FormData) {
  const { text, contentType, imageData, geoLat, geoLong, profileId } =
    validatePostFormData(formData);
  const parentPostIdRaw = formData.get("parent_post_id") as string;

  if (!parentPostIdRaw || typeof parentPostIdRaw !== "string") {
    throw new Error("Parent post ID is required");
  }

  const parentPostId = parseInt(parentPostIdRaw);
  if (isNaN(parentPostId)) {
    throw new Error("Invalid parent post ID");
  }

  return {
    text,
    contentType,
    imageData,
    geoLat,
    geoLong,
    profileId,
    parentPostId,
  };
}

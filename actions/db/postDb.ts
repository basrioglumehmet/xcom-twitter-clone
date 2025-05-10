import { SupabaseClient } from "@supabase/supabase-js";
import {
  PostWithProfile,
  PostInsertParams,
  ReplyInsertParams,
  RepostInsertParams,
} from "@/model/postModel";

export async function fetchUserPosts(
  supabase: SupabaseClient,
  profileId: string
): Promise<PostWithProfile[] | null> {
  if (!profileId || typeof profileId !== "string") {
    throw new Error("Invalid user ID");
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      user_profiles:user_profiles(id, screen_name, profile_image_url),
      post_images(url)
    `
    )
    .eq("profile_id", profileId);

  if (error) {
    console.error("Error fetching user posts:", error.message);
    return null;
  }

  return data as PostWithProfile[];
}

export async function insertPost(
  supabase: SupabaseClient,
  params: PostInsertParams
): Promise<number> {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    throw new Error("User is not authenticated");
  }

  const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert({
      profile_id: params.profileId,
      content: params.text,
      content_type: params.contentType,
      geo_lat: params.geoLat,
      geo_long: params.geoLong,
      view_count: 0,
    })
    .select()
    .single();

  if (postError) {
    throw new Error(`Failed to insert post: ${postError.message}`);
  }

  if (params.imageUrl) {
    const { error: imageError } = await supabase.from("post_images").insert({
      post_id: postData.id,
      url: params.imageUrl,
    });

    if (imageError) {
      await supabase.from("posts").delete().eq("id", postData.id);
      throw new Error(`Failed to insert post image: ${imageError.message}`);
    }
  }

  return postData.id;
}

export async function validateParentPost(
  supabase: SupabaseClient,
  parentPostId: number
): Promise<void> {
  const { data: parentPost, error: parentPostError } = await supabase
    .from("posts")
    .select("id")
    .eq("id", parentPostId)
    .single();

  if (parentPostError || !parentPost) {
    throw new Error("Parent post does not exist");
  }
}

export async function insertReply(
  supabase: SupabaseClient,
  params: ReplyInsertParams
): Promise<void> {
  const { data: existingReply, error: existingReplyError } = await supabase
    .from("post_replies")
    .select("reply_post_id")
    .eq("reply_post_id", params.reply_post_id)
    .single();

  if (existingReplyError && existingReplyError.code !== "PGRST116") {
    throw new Error(
      `Failed to check existing reply: ${existingReplyError.message}`
    );
  }
  if (existingReply) {
    throw new Error("This post is already a reply to another post");
  }

  const { error } = await supabase.from("post_replies").insert(params);

  if (error) {
    if (error.code === "23505" && error.message.includes("uq_reply")) {
      throw new Error("This post is already a reply to another post");
    }
    throw new Error(`Failed to insert reply: ${error.message}`);
  }
}

export async function insertRepost(
  supabase: SupabaseClient,
  params: RepostInsertParams
): Promise<void> {
  const { data: existingRepost, error: existingRepostError } = await supabase
    .from("post_reposts")
    .select("repost_id")
    .eq("repost_id", params.repost_id)
    .single();

  if (existingRepostError && existingRepostError.code !== "PGRST116") {
    throw new Error(
      `Failed to check existing repost: ${existingRepostError.message}`
    );
  }
  if (existingRepost) {
    throw new Error("This post is already a repost to another post");
  }

  const { error } = await supabase.from("post_reposts").insert(params);

  if (error) {
    if (error.code === "23505" && error.message.includes("uq_reply")) {
      throw new Error("This post is already a reposted to another post");
    }
    throw new Error(`Failed to insert repost: ${error.message}`);
  }
}

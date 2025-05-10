import { UserProfileModel } from "./userProfileModel";

export enum ContentType {
  Text = "text",
  Image = "image",
  Video = "video",
}

// Base PostModel, matching the 'posts' table structure
export interface PostModel {
  id: number;
  profile_id: number;
  content: string;
  content_type: ContentType;
  geo_lat?: number | null;
  geo_long?: number | null;
  view_count: number;
  created_at: string;
}

// PostWithProfile, matching the Supabase query structure
export interface PostWithProfile extends PostModel {
  user_profiles: UserProfileModel; // Matches the 'user_profiles' alias in the query
  post_images: { id: number; post_id: number; url: string }[]; // Matches the 'post_images' alias
}

// ExtendedPostModel, including interaction flags and parent post
export interface ExtendedPostModel extends PostWithProfile {
  isRepliedByYou: boolean;
  isRepostedByYou: boolean;
  parentPost?: PostWithProfile | null; // Parent post for reposts
}

// Parameters for inserting a new post
export interface PostInsertParams {
  imageUrl?: string | null;
  text: string;
  contentType: ContentType;
  geoLat?: number | null;
  geoLong?: number | null;
  profileId: number;
}

// Parameters for inserting a reply
export interface ReplyInsertParams {
  parent_post_id: number;
  reply_post_id: number;
}

// Parameters for inserting a repost
export interface RepostInsertParams {
  parent_post_id: number;
  repost_id: number;
}

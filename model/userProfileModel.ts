export interface UserProfileModel {
  id?: string;
  user_id: string;
  screen_name: string;
  profile_image_url?: string;
  tag_name: string;
  location?: string;
  url?: string;
  description?: string;
  is_verified: boolean;
  created_at: Date;
}

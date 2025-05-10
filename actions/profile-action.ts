"use server";

import { UserProfileModel } from "@/model/userProfileModel";
import { createClient } from "@/utils/supabase/server";

// Define return type explicitly
export async function fetchUserProfile(
  userId: string
): Promise<UserProfileModel | null> {
  try {
    // Validate input
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }

    console.log("Fetching user profile for:", userId);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error.message);
      return null;
    }

    return data as UserProfileModel;
  } catch (error) {
    console.error("Unexpected error fetching user profile:", error);
    return null;
  }
}

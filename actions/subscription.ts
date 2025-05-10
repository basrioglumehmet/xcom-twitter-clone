"use server";

import { createClient } from "@/utils/supabase/server";

export async function checkSubscription(userId: string): Promise<boolean> {
  try {
    console.log(userId);
    const supabase = await createClient();
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .limit(1)
      .single();  

    return !!subscription; // Returns true if an active subscription exists, false otherwise
  } catch (err) {
    console.error("Unexpected error checking subscription:", err);
    throw err; // Rethrow to allow caller to handle
  }
}

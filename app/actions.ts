"use server";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserProfileModel } from "@/model/userProfileModel";
import { SupabaseClient } from "@supabase/supabase-js";
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }
  const functionResult = await supabase.rpc("check_user_exists_by_id", {
    user_email: email,
  });

  if (functionResult.data == false) {
    return generateNewAccount(email, password, supabase, origin);
  } else {
    return encodedRedirect("error", "/sign-up", "Email is taken");
  }
};

export const regenerateOtpCodeAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return encodedRedirect(
    "success",
    "/sign-in",
    "Please check your email for a verification link."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/dashboard/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

async function generateNewAccount(
  email: string,
  password: string,
  supabase: SupabaseClient<any, "public", any>,
  origin: string | null
) {
  const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  const userId = signUpData.user?.id;

  if (userId) {
    // Create a new profile
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
      separator: "_",
    });
    const profileObject = {
      is_verified: false,
      screen_name: shortName,
      tag_name: shortName.replaceAll("_", ""),
      user_id: userId,
    } as UserProfileModel;

    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert(profileObject);

    if (profileError) {
      console.error("Profile insert error: ", profileError.message);
      console.error("Profile object: ", profileObject);
      return encodedRedirect("error", "/sign-up", "Failed to create profile");
    }

    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
}

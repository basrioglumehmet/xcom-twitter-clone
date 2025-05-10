"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAppDispatch } from "@/store/configureStore";
import { toggleOperationModal } from "@/store/actions/operationModalActions";

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const authenticate = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const redirectTo = hashParams.get("redirect_to") || "/dashboard";

      const error = searchParams.get("error");
      const errorCode = searchParams.get("error_code");
      const errorDescription = searchParams.get("error_description");

      console.log("errorCode:", errorCode); // Debugging log
      console.log("error:", error); // Debugging log
      console.log("errorDescription:", errorDescription); // Debugging log

      if (error) {
        // Eğer URL query string'inde hata varsa login'e yönlendir
        const encoded = encodeURIComponent(
          errorDescription || error || "Unknown error"
        );
        if (errorCode === "otp_expired") {
          console.log("OTP expired error detected"); // Debugging log
          router.replace(
            `/otp?error=${"Otp code is expired"}&error_code=${errorCode}`
          );
          return;
        } else {
          router.replace(`/sign-in?error=${encoded}`);
          return;
        }
      }

      if (accessToken && refreshToken) {
        const supabase = createClient();
        // Set the session in Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error("Failed to set session:", sessionError);
          router.replace(
            `/sign-in?error=${encodeURIComponent("Failed to authenticate")}`
          );
          return;
        }
      } else {
        router.replace("/sign-in");
      }
    };

    authenticate();
  }, [router]);

  return <p className="text-white text-sm">Signing you in...</p>;
}

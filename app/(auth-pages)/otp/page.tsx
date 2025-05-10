import { regenerateOtpCodeAction, signInAction } from "@/app/actions";
import Logo from "@/components/logo";
import LogoText from "@/components/LogoText";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ResendOtpButton } from "@/components/resendotp-button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <form className="flex flex-col items-start justify-center  gap-5">
      <h1 className="text-7xl font-bold">Happening now</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Join today.
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 w-full">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <ResendOtpButton
          pendingText="Resending..."
          formAction={regenerateOtpCodeAction}
        >
          Resend an OTP
        </ResendOtpButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}

"use client";

import { subscribeAction } from "@/actions/stripe";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import PremiumLottie from "./ui/premium-lottie";

type Props = {
  userId: string;
  disabled?: boolean;
  isSubscribed?: boolean;
};

function SubscribeButton({ userId, disabled, isSubscribed }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClickSubscribeButton = async () => {
    startTransition(async () => {
      try {
        const { url } = await subscribeAction(userId);
        window.location.href = url; // Direct redirect to Stripe Checkout
      } catch (error) {
        console.error("Checkout error:", error);
      }
    });
  };

  return (
    <button
      disabled={isPending || disabled}
      onClick={handleClickSubscribeButton}
      className="bg-primary disabled:bg-primary/50 text-white disabled:text-white/50 rounded-lg p-2 hover:bg-opacity-80 transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
    >
      {isSubscribed ? (
        <span className="text-sm font-bold">Subscribed</span>
      ) : (
        <span className="text-sm font-bold">Subscribe</span>
      )}
      {isPending && (
        <div className="w-5 h-5 animate-spin border-2 border-t-transparent border-white rounded-full"></div>
      )}
    </button>
  );
}

export default SubscribeButton;

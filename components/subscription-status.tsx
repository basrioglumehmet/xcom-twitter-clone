"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import PremiumLottie from "@/components/ui/premium-lottie";
import SubscribeButton from "./subscribe-button";
import { Skeleton } from "./ui/skeleton";
import { RotateLoading, SpinLoading } from "respinner";

interface SubscriptionStatusProps {
  userId: string;
  initialIsSubscribed: boolean;
}

export default function SubscriptionStatus({
  userId,
  initialIsSubscribed,
}: SubscriptionStatusProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      console.warn("No userId provided, skipping subscription logic");
      setIsLoading(false);
      setIsSubscribed(false);
      return;
    }

    // Fetch current subscription status on mount
    const fetchSubscriptionStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", userId)
          .eq("status", "active")
          .single();

        if (error) {
          console.error("Error fetching subscription status:", error);
          setIsSubscribed(false);
        } else {
          setIsSubscribed(!!data);
        }
      } catch (err) {
        console.error("Unexpected error fetching subscription:", err);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionStatus();

    // Set up real-time subscription
    const subscriptionChannel = supabase
      .channel(`subscriptions:${userId}`) // Unique channel name to avoid conflicts
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Subscription change detected:", payload);
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            console.log("New subscription status:", payload.new.status);
            setIsSubscribed(payload.new.status === "active");
          } else if (payload.eventType === "DELETE") {
            console.log("Subscription deleted");
            setIsSubscribed(false);
          }
        }
      )
      .subscribe((status, error) => {
        console.log("Real-time subscription status:", status);
        if (error) {
          console.error("Real-time subscription error:", error);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up subscription channel for userId:", userId);
      supabase.removeChannel(subscriptionChannel);
    };
  }, [userId, supabase]);

  if (isLoading) {
    return (
      <div className="border h-40 rounded-xl p-2 flex flex-col items-center justify-center gap-5">
        <RotateLoading duration={0.5} size={60} stroke="#3b82f6" />
      </div>
    );
  }

  return (
    <div className="border p-2 flex flex-col gap-5 rounded-xl h-40 justify-center">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5">
            <PremiumLottie />
          </div>
          <h4 className="font-bold text-lg">
            {isSubscribed ? "Premium Plan" : "Subscribe to Premium Plan"}
          </h4>
        </div>
        <p>
          {isSubscribed
            ? "You are subscribed to the premium plan."
            : "Get access to exclusive features and content by subscribing to our premium plan."}
        </p>
      </div>
      <SubscribeButton
        isSubscribed={isSubscribed}
        disabled={!userId || isSubscribed}
        userId={userId}
      />
    </div>
  );
}

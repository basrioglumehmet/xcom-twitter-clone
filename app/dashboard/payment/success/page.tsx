import SuccessLottie from "@/components/ui/success-lottie";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    console.error("No session ID provided");
    redirect("/dashboard/payment/cancel");
  }

  try {
    // Retrieve the Checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    console.log("Retrieved session:", session);

    // Check if session has a subscription
    if (!session.subscription) {
      console.error("No subscription found in session:", sessionId);
      redirect("/dashboard/payment/cancel");
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id
    );

    const supabase = await createClient();

    // Check if a subscription already exists for the user
    const { data: existingSubscription, error: checkError } = await supabase
      .from("subscriptions")
      .select("subscription_id, status")
      .eq("user_id", session.metadata?.userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is expected if no subscription exists
      console.error("Error checking existing subscription:", checkError);
      throw new Error("Failed to check existing subscription");
    }

    if (existingSubscription) {
      console.log(
        `Subscription already exists for user ${session.metadata?.userId}:`,
        existingSubscription
      );
      // Optionally update the existing subscription if needed
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          subscription_id: subscription.id,
          status: subscription.status,
          plan: "Premium Subscription",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", session.metadata?.userId);

      if (updateError) {
        console.error("Error updating subscription:", updateError);
        throw new Error("Failed to update subscription");
      }
    } else {
      // Insert new subscription
      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: session.metadata?.userId,
          subscription_id: subscription.id,
          status: subscription.status,
          plan: "Premium Subscription",
        });

      if (insertError) {
        console.error("Error inserting subscription:", insertError);
        throw new Error("Failed to insert subscription");
      }
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <SuccessLottie />
        <p>
          Thank you for subscribing. Your subscription is {subscription.status}.
        </p>
      </main>
    );
  } catch (error) {
    console.error("Error processing subscription:", error);
    redirect("/dashboard/payment/cancel");
  }
}

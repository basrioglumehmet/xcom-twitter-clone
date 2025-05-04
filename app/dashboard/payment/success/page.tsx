import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams; // Await searchParams
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

    // Log session for debugging
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

    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: session.metadata?.userId,
        subscription_id: subscription.id,
        status: subscription.status,
        plan: "Premium Subscription", // Adjust based on your plan
      })
      .eq("subscription_id", subscription.id); // Adjust condition for your update logic

    if (error) {
      console.error("Error updating subscription:", error);
      // Handle error (e.g., redirect to an error page)
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold">Subscription Successful!</h1>
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

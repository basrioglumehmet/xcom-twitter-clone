"use server";

import { stripe } from "@/lib/stripe";

export async function subscribeAction(userId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        "NEXT_PUBLIC_BASE_URL is not defined in environment variables"
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/payment/cancel`,
      metadata: { userId },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session: No session URL");
    }

    return { url: session.url };
  } catch (error) {
    console.error("Checkout error:", error);
    throw new Error("Failed to initiate checkout");
  }
}

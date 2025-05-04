import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const { price, quantity } = await request.json();
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_PRICE_ID,
          quantity: quantity || 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/payment/cancel`,
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

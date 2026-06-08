import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { data: cartItems } = await supabase
    .from("cart")
    .select(`
      quantity,
      products (
        id,
        product_title,
        price
      )
    `)
    .eq("user_id", user.id);

  const lineItems =
    cartItems?.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.products.product_title,
        },
        unit_amount: Math.round(
          item.products.price * 100
        ),
      },
      quantity: item.quantity,
    })) || [];

  const session =
    await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: lineItems,

      success_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,

      metadata: {
        userId: user.id,

        customer_name: body.customer_name,
        customer_email: body.customer_email,
        phone: body.phone || "",
        address: body.address,
        city: body.city,
        country: body.country || "",
        postal_code: body.postal_code || "",
      },
    });

  return NextResponse.json({
    url: session.url,
  });
}
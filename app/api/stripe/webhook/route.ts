import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get(
    "stripe-signature"
  );

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Load cart
    const { data: cartItems, error: cartError } =
      await supabase
        .from("cart")
        .select(`
          id,
          quantity,
          product_id,
          products (
            id,
            product_title,
            price
          )
        `)
        .eq("user_id", userId);

    if (cartError || !cartItems?.length) {
      return NextResponse.json(
        { error: "Cart empty" },
        { status: 400 }
      );
    }

    const totalAmount = cartItems.reduce(
      (sum: number, item: any) =>
        sum +
        item.quantity * item.products.price,
      0
    );

    // Create Order
    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          user_id: userId,

          customer_name:
            session.metadata?.customer_name || "",

          customer_email:
            session.metadata?.customer_email || "",

          phone:
            session.metadata?.phone || "",

          address:
            session.metadata?.address || "",

          city:
            session.metadata?.city || "",

          country:
            session.metadata?.country || "",

          postal_code:
            session.metadata?.postal_code || "",

          total_amount: totalAmount,

          status: "pending",
        })
        .select()
        .single();

    if (orderError) {
      console.error(orderError);
      return NextResponse.json(
        { error: orderError.message },
        { status: 500 }
      );
    }

    // Create Order Items
    const orderItems = cartItems.map(
      (item: any) => ({
        order_id: order.id,

        product_id: item.product_id,

        product_name:
          item.products.product_title,

        price: item.products.price,

        quantity: item.quantity,
      })
    );

    const { error: itemsError } =
      await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
      console.error(itemsError);
    }

    // Clear Cart
    await supabase
      .from("cart")
      .delete()
      .eq("user_id", userId);
  }

  return NextResponse.json({
    received: true,
  });
}
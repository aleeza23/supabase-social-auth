import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

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

  const {
    customer_name,
    customer_email,
    phone,
    address,
    city,
    country,
    postal_code,
  } = body;

  // Get Cart
  const { data: cartItems, error: cartError } = await supabase
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

  if (cartError) {
    return NextResponse.json(
      { error: cartError.message },
      { status: 500 }
    );
  }

  if (!cartItems?.length) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + item.quantity * item.products.price;
  }, 0);

  // Create Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      customer_name,
      customer_email,
      phone,
      address,
      city,
      country,
      postal_code,
      total_amount: total,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json(
      { error: orderError.message },
      { status: 500 }
    );
  }

  // Create Order Items
  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.products.id,
    product_name: item.products.product_title,
    price: item.products.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return NextResponse.json(
      { error: itemsError.message },
      { status: 500 }
    );
  }

  // Clear Cart
  await supabase
    .from("cart")
    .delete()
    .eq("user_id", user.id);

  return NextResponse.json({
    success: true,
    orderId: order.id,
  });
}
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      id,
      quantity,
      product_id,
      products (
        id,
        product_title,
        description,
        image
      )
    `,
    )
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { product_id, quantity = 1 } = body;

  // Check existing cart item
  const { data: existingItem } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .maybeSingle();

  // Update quantity if exists
  if (existingItem) {
    const { data, error } = await supabase
      .from("cart")
      .update({
        quantity: existingItem.quantity + quantity,
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  // Insert new item
  const { data, error } = await supabase
    .from("cart")
    .insert([
      {
        user_id: user.id,
        product_id,
        quantity,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    status: 201,
  });
}

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
    `
    )
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

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

  const { product_id, quantity = 1 } = body;

  // Check existing item
  const { data: existing } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", product_id)
    .single();

  // If exists increase quantity
  if (existing) {
    const { data, error } = await supabase
      .from("cart")
      .update({
        quantity: existing.quantity + quantity,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  }

  // Create new
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
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
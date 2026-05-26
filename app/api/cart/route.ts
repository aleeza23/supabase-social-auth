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

  const { product_id, quantity = 1 } = await req.json();

  // FORCE matching type (important fix)
  const pid = Number(product_id);

  const { data: existingItem } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", pid)
    .maybeSingle();

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

  const { data, error } = await supabase
    .from("cart")
    .insert([
      {
        user_id: user.id,
        product_id: pid,
        quantity,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

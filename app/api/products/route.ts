import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `
    );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const body = await req.json();

  const {
    product_title,
    description,
    image,
    category_id,
  } = body;

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        product_title,
        description,
        image,
        category_id: category_id || null,
      },
    ])
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `
    )
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", parseInt(id, 10))
    .single();

  if (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const supabase = await createClient();
  const body = await req.json();

  // Strip id from body just in case it leaked in
  const { id: _drop, ...cleanBody } = body;

  console.log("Updating id:", numericId, "with:", cleanBody); // ← debug log

  const { data, error } = await supabase
    .from("products")
    .update(cleanBody)
    .eq("id", numericId)
    .select()
    .single();

  if (error) {
    console.error("PUT Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", numericId);

  if (error) {
    console.error("DELETE Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
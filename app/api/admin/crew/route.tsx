import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "crew");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const userId = data.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 400 },
    );
  }

  await supabaseAdmin
    .from("profiles")
    .update({ role: "crew" })
    .eq("id", userId);

  return NextResponse.json({
    message: "Crew created successfully",
  });
}

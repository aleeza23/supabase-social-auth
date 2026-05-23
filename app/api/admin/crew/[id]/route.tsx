import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";


type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  req: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const { email, password } = body;

    const updateData: {
      email?: string;
      password?: string;
    } = {};

    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const { error } =
      await supabaseAdmin.auth.admin.updateUserById(
        id,
        updateData
      );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Update email in profiles table
    if (email) {
      await supabaseAdmin
        .from("profiles")
        .update({
          email,
        })
        .eq("id", id);
    }

    return NextResponse.json({
      message: "Crew updated successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const { error } =
      await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Crew deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
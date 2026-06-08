import Link from "next/link";
import React, { Suspense } from "react";
import { AuthButton } from "./auth-button";
import { createClient } from "@/lib/supabase/server";
import CartButton from "./cart-btn";

const Navbar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  if (user) {
    const { count } = await supabase
      .from("cart")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    cartCount = count || 0;
  }

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/">Next.js Supabase</Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Drawer Button */}
          {user && (
            <CartButton cartCount={cartCount} />
          )}

          {/* Auth */}
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
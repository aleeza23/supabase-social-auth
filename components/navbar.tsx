import Link from "next/link";
import React, { Suspense } from "react";
import { ShoppingCart } from "lucide-react";
import { AuthButton } from "./auth-button";
import { createClient } from "@/lib/supabase/server";

const Navbar = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  // Get cart items count
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
          <Link href={"/"}>Next.js Supabase</Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Cart */}
          {user && (
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 hover:border-amber-400/40 hover:text-amber-400 transition-all"
            >
              <ShoppingCart size={18} />

              {/* Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
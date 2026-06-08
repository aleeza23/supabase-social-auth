"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import CartDrawer from "./modals/CartModal";

type Props = {
  cartCount: number;
};

export default function CartButton({
  cartCount,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 hover:border-amber-400/40 hover:text-amber-400 transition-all"
      >
        <ShoppingCart size={18} />

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
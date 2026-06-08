"use client";

import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import { useCart, useRemoveFromCart } from "@/lib/hooks/use-cart";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({
  open,
  onClose,
}: Props) {
  const { data: cart = [], isLoading } =
    useCart();

  const { mutate: removeItem } =
    useRemoveFromCart();

  if (!open) return null;

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <div
        className="
          fixed
          top-0
          right-0
          h-screen
          w-full
          sm:w-[450px]
          bg-white
          z-50
          flex
          flex-col
        "
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            Shopping Cart
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && (
            <p>Loading...</p>
          )}

          {cart.length === 0 && (
            <div className="text-center mt-20">
              Cart is empty
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b py-4"
            >
              <img
                src={item.products.image}
                alt=""
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h3 className="font-medium">
                  {item.products.product_title}
                </h3>

                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <button
                onClick={() =>
                  removeItem(item.id)
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t p-5">
          <div className="mb-4">
            Items: {totalItems}
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-black text-white text-center py-3 rounded-lg"
          >
            Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
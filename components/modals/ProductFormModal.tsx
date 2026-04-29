"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Product } from "@/components/ui/product-card";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/use-products";

type Props = {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
};

const empty = { product_title: "", description: "", image: "" };

export default function ProductFormModal({ open, onClose, product }: Props) {
  const [form, setForm] = useState(empty);
  const create = useCreateProduct();
  const update = useUpdateProduct();

  useEffect(() => {
    setForm(
      product
        ? {
            product_title: product.product_title,
            description: product.description,
            image: product.image ?? "",
          }
        : empty,
    );
  }, [product, open]);

  if (!open) return null;

  const isPending = create.isPending || update.isPending;

  const handleSubmit = async () => {
    if (product?.id) {
      // ✅ explicitly pull id from the original product prop, not from form
      await update.mutateAsync({
        id: product.id,
        product_title: form.product_title,
        description: form.description,
        image: form.image,
      });
    } else {
      await create.mutateAsync({
        product_title: form.product_title,
        description: form.description,
        image: form.image,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[#0e0e11] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-white font-bold text-lg"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Title", key: "product_title", multiline: false },
            { label: "Image URL", key: "image", multiline: false },
            { label: "Description", key: "description", multiline: true },
          ].map(({ label, key, multiline }) => (
            <div key={key}>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1.5">
                {label}
              </label>
              {multiline ? (
                <textarea
                  rows={3}
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 outline-none focus:border-amber-400/50 transition-colors resize-none"
                />
              ) : (
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5 outline-none focus:border-amber-400/50 transition-colors"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : product ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

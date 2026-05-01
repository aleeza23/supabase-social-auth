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

const empty = {
  product_title: "",
  description: "",
  image: "",
};

export default function ProductFormModal({ open, onClose, product }: Props) {
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);

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

  // Upload image to Supabase Storage
  const uploadImage = async () => {
    if (!file) return form.image;

    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data.url;
  };

  const handleSubmit = async () => {
    try {
      const imageUrl = await uploadImage();

      if (product?.id) {
        await update.mutateAsync({
          id: product.id,
          product_title: form.product_title,
          description: form.description,
          image: imageUrl,
        });
      } else {
        await create.mutateAsync({
          product_title: form.product_title,
          description: form.description,
          image: imageUrl,
        });
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[#0e0e11] border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">
            {product ? "Edit Product" : "New Product"}
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <input
            placeholder="Product Title"
            value={form.product_title}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                product_title: e.target.value,
              }))
            }
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5"
          />

          {/* Description */}
          <textarea
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                description: e.target.value,
              }))
            }
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white text-sm px-4 py-2.5"
          />

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-white"
          />

          {/* Preview */}
          {(file || form.image) && (
            <img
              src={file ? URL.createObjectURL(file) : form.image}
              alt="Preview"
              className="w-full h-40 object-cover rounded-xl"
            />
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-amber-400 text-black font-semibold"
          >
            {isPending ? "Saving..." : product ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

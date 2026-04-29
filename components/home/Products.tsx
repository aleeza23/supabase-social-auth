"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ProductCard, { type Product } from "@/components/ui/product-card";
import { useProducts, useDeleteProduct } from "@/lib/hooks/use-products";
import ProductFormModal from "../modals/ProductFormModal";

export default function ProductsView() {
  const { data: products, isLoading, isError } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [modal, setModal] = useState<{ open: boolean; product?: Product | null }>({ open: false });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-white/20 text-sm tracking-widest uppercase">
      Loading…
    </div>
  );
  if (isError) return <p className="text-rose-400 text-center">Failed to load products</p>;

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Products
          </h1>
          <button
            onClick={() => setModal({ open: true, product: null })}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(p) => setModal({ open: true, product: p })}
              onDelete={(id) => deleteProduct.mutate(id)}
            />
          ))}
        </div>
      </div>

      <ProductFormModal
        open={modal.open}
        product={modal.product}
        onClose={() => setModal({ open: false })}
      />
    </>
  );
}
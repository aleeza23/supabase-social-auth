"use client";

import { useState } from "react";
import { Plus, Package, Pencil, Trash2, BarChart3, ShoppingBag } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/lib/hooks/use-products";
import type { Product } from "@/components/ui/product-card";
import ProductFormModal from "@/components/modals/ProductFormModal";

export default function AdminDashboard() {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [modal, setModal] = useState<{ open: boolean; product?: Product | null }>({ open: false });

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-amber-400" },
    { label: "Active Listings", value: products.length, icon: ShoppingBag, color: "text-emerald-400" },
    { label: "Categories", value: "—", icon: BarChart3, color: "text-sky-400" },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#080809] text-white p-6 md:p-10"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs text-amber-400/60 tracking-[0.3em] uppercase mb-1"
              style={{ fontFamily: "system-ui" }}>
              Admin
            </p>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <button
            onClick={() => setModal({ open: true, product: null })}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            style={{ fontFamily: "system-ui" }}
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl bg-[#0e0e11] border border-white/[0.06] p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/30 mt-0.5" style={{ fontFamily: "system-ui" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-[#0e0e11] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-base font-semibold text-white">All Products</h2>
            <span className="text-xs text-white/30" style={{ fontFamily: "system-ui" }}>
              {products.length} items
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-white/20 text-sm tracking-widest uppercase"
              style={{ fontFamily: "system-ui" }}>
              Loading…
            </div>
          ) : (
            <table className="w-full" style={{ fontFamily: "system-ui" }}>
              <thead>
                <tr className="text-left text-xs text-white/20 uppercase tracking-widest border-b border-white/[0.06]">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3 hidden md:table-cell">Description</th>
                  <th className="px-6 py-3 hidden md:table-cell">Image</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-white/20 text-sm">#{product.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">{product.product_title}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-white/30 line-clamp-1 max-w-xs block">
                        {product.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {product.image ? (
                        <span className="text-xs text-amber-400/60 truncate max-w-[120px] block">
                          {product.image}
                        </span>
                      ) : (
                        <span className="text-xs text-white/20">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setModal({ open: true, product })}
                          className="p-2 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct.mutate(product.id)}
                          className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
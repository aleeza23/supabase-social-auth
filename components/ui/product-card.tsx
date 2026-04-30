"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, ArrowUpRight } from "lucide-react";

export type Product = {
  id: number;
  product_title: string;
  description: string;
  image?: string;
};

type Props = {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
};

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#0e0e11] border border-white/[0.06] shadow-xl transition-all duration-500 hover:border-amber-400/30 hover:shadow-amber-500/10 hover:shadow-2xl hover:-translate-y-1">
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="block relative h-52 w-full overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.product_title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
            <span className="text-4xl opacity-20">◈</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-transparent to-transparent" />

        {/* Arrow icon top right */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          <div className="bg-amber-400 text-black rounded-full p-1.5">
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`}>
            <h3
              className="font-bold text-base text-white tracking-tight leading-snug hover:text-amber-400 transition-colors line-clamp-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.product_title}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-white/40 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>
      </div>
    </div>
  );
}

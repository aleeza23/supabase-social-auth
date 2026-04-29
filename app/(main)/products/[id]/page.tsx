"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { useProduct, useProducts } from "@/lib/hooks/use-products";
import Link from "next/link";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(Number(id));
  const { data: all = [] } = useProducts();
  const [slide, setSlide] = useState(0);

  const related = all.filter((p) => p.id !== Number(id));
  const prev = () => setSlide((s) => (s - 1 + related.length) % related.length);
  const next = () => setSlide((s) => (s + 1) % related.length);

  if (isLoading) return (
    <div className="min-h-screen bg-[#080809] flex items-center justify-center text-white/20 tracking-widest text-sm uppercase">
      Loading…
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#080809] flex items-center justify-center text-white/40">
      Product not found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080809] text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* Back */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/30 hover:text-amber-400 transition-colors text-sm"
          style={{ fontFamily: "system-ui" }}
        >
          <ChevronLeft size={16} />
          Back
        </button>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/60">
          {product.image ? (
            <Image src={product.image} alt={product.product_title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a]">
              <span className="text-7xl opacity-10">◈</span>
            </div>
          )}
          {/* Amber glow */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: "system-ui" }}>
              Product Details
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
              {product.product_title}
            </h1>
          </div>

          <div className="w-12 h-px bg-amber-400/40" />

          <p className="text-white/50 leading-relaxed text-base" style={{ fontFamily: "system-ui" }}>
            {product.description}
          </p>

          <div className="flex gap-3 pt-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition-colors"
              style={{ fontFamily: "system-ui" }}
            >
              Browse All
            </Link>
          </div>
        </div>
      </section>

      {/* Related Slider */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">More Products</h2>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-400/30 transition-all"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={next}
                className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-400/30 transition-all"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Slide track — show 3 at a time */}
          <div className="overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(-${slide * (100 / 3)}% - ${slide * (20 / 3)}px))` }}
            >
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="min-w-[calc(33.333%-14px)] group block rounded-2xl overflow-hidden border border-white/[0.06] hover:border-amber-400/30 transition-all duration-300 bg-[#0e0e11]"
                >
                  <div className="relative h-40 overflow-hidden">
                    {p.image ? (
                      <Image src={p.image} alt={p.product_title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a]">
                        <span className="text-3xl opacity-10">◈</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {p.product_title}
                    </h3>
                    <p className="text-xs text-white/30 mt-1 line-clamp-1" style={{ fontFamily: "system-ui" }}>
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {related.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === slide ? "w-8 bg-amber-400" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
import Image from "next/image";

export type Product = {
  id: number;
  product_title: string;
  description: string;
  image?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.product_title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold transition-colors duration-300 text-indigo-400">
          {product.product_title}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />
      </div>
    </div>
  );
}
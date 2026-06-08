import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">
        🎉 Order Placed
      </h1>

      <p className="text-gray-500 mb-8">
        Thank you for your purchase.
      </p>

      <Link
        href="/"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
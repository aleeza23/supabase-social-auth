"use client";

import { useCart } from "@/lib/hooks/use-cart";
import { usePlaceOrder } from "@/lib/hooks/use-orders";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const { data: cart = [] } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.products.price,
    0,
  );

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const res = await fetch(
    "/api/stripe/checkout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        customer_name: formData.get("name"),
        customer_email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        country: formData.get("country"),
        postal_code: formData.get("postal"),
      }),
    }
  );

  const data = await res.json();

  window.location.href = data.url;
};

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full border p-3 rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border p-3 rounded"
          />

          <input
            name="phone"
            placeholder="Phone"
            className="w-full border p-3 rounded"
          />

          <input
            name="address"
            placeholder="Address"
            required
            className="w-full border p-3 rounded"
          />

          <input
            name="city"
            placeholder="City"
            required
            className="w-full border p-3 rounded"
          />

          <input
            name="country"
            placeholder="Country"
            className="w-full border p-3 rounded"
          />

          <input
            name="postal"
            placeholder="Postal Code"
            className="w-full border p-3 rounded"
          />

          <button
            disabled={isPending}
            className="w-full bg-black text-white py-4 rounded"
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="border rounded-lg p-5">
          <h2 className="font-bold mb-4">Order Summary</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>
                {item.products.product_title}× {item.quantity}
              </span>

              <span>${(item.products.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

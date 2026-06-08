"use client";

import { usePlaceOrder } from "@/lib/hooks/use-orders";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const {
    mutate: placeOrder,
    isPending,
  } = usePlaceOrder();

const handleSubmit = (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  console.log("FORM SUBMITTED");

  const formData = new FormData(e.currentTarget);

  placeOrder(
    {
      customer_name: formData.get("name") as string,
      customer_email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      postal_code: formData.get("postal") as string,
    },
    {
      onSuccess: (data) => {
        console.log("SUCCESS", data);

        router.push(
          `/checkout/success?id=${data.orderId}`
        );
      },

      onError: (error) => {
        console.error("ERROR", error);
      },
    }
  );
};

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
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
          {isPending
            ? "Placing Order..."
            : "Place Order"}
        </button>
      </form>
    </div>
  );
}
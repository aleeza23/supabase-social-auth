import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Types
export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  total_amount: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  created_at: string;
  order_items: OrderItem[];
};

// Fetcher
async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.error ?? `Request failed: ${res.status}`
    );
  }

  return res.json();
}

const json = (body: unknown) => ({
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

// API
const api = {
  // Customer Orders
  getOrders: () =>
    fetcher<Order[]>("/api/orders/history"),

  // Admin Orders
  getAdminOrders: () =>
    fetcher<Order[]>("/api/admin/orders"),

  // Checkout
  placeOrder: (body: {
    customer_name: string;
    customer_email: string;
    phone?: string;
    address: string;
    city: string;
    country?: string;
    postal_code?: string;
  }) =>
    fetcher<{
      success: boolean;
      orderId: number;
    }>("/api/orders", {
      method: "POST",
      ...json(body),
    }),

  // Update Order Status
  updateStatus: ({
    id,
    status,
  }: {
    id: number;
    status: string;
  }) =>
    fetcher<Order>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      ...json({ status }),
    }),
};

// Hooks

// Customer Orders
export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: api.getOrders,
  });

// Checkout
export const usePlaceOrder = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.placeOrder,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["cart"],
      });

      qc.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};

// Admin Orders
export const useAdminOrders = () =>
  useQuery({
    queryKey: ["admin-orders"],
    queryFn: api.getAdminOrders,
  });

// Update Status
export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.updateStatus,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      qc.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
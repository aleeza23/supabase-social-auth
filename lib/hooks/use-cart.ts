import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Types
export type CartItem = {
  id: number;
  quantity: number;
  product_id: number;
  products: {
    id: number;
    product_title: string;
    description: string;
    image: string;
    price: number;
  };
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
  getAll: () => fetcher<CartItem[]>("/api/cart"),

  add: (body: {
    product_id: number;
    quantity?: number;
  }) =>
    fetcher<CartItem>("/api/cart", {
      method: "POST",
      ...json(body),
    }),

  remove: (id: number) =>
    fetcher<void>(`/api/cart/${id}`, {
      method: "DELETE",
    }),
};

// Hooks
export const useCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: api.getAll,
  });

export const useAddToCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.add,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.remove,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};
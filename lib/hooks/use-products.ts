import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/components/ui/product-card";

// Base fetcher
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

const json = (body: unknown) => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// API
const api = {
  getAll: () => fetcher<Product[]>("/api/products"),

  getOne: (id: number) => fetcher<Product>(`/api/products/${id}`),

  create: (body: Omit<Product, "id">) =>
    fetcher<Product>("/api/products", { method: "POST", ...json(body) }),

  update: ({ id, ...body }: Product) =>
    fetcher<Product>(`/api/products/${id}`, { method: "PUT", ...json(body) }),

  delete: (id: number) =>
    fetcher<void>(`/api/products/${id}`, { method: "DELETE" }),
};

// Hooks
export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: api.getAll });

export const useProduct = (id: number) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => api.getOne(id),
    enabled: !!id,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.update,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["products", data.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

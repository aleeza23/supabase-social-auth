import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/components/ui/product-card";

// Fetchers
const api = {
  getAll: async (): Promise<Product[]> => {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },
  getOne: async (id: number): Promise<Product> => {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },
  create: async (body: Omit<Product, "id">): Promise<Product> => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
  },
  update: async ({ id, ...body }: Product): Promise<Product> => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // ← only send fields, NOT id
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update product");
    }
    return res.json();
  },
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
  },
};

// Hooks
export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: api.getAll });

// GET SINGLE PRODUCT
export const useProduct = (id: number) =>
  useQuery({ queryKey: ["products", id], queryFn: () => api.getOne(id) });

// CREATE PRODUCT
export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

//UPDATE PRODUCT
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

// DELETE PRODUCT
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

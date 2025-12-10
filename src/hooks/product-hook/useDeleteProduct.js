// src/hooks/useDeleteProduct.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};

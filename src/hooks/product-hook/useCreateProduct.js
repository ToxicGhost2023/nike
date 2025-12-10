// src/hooks/useCreateProduct.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post("/products", formData);
      return data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};

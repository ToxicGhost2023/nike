import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, formData }) => {
      const { data } = await api.patch(`/products/${productId}`, formData);
      return data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};

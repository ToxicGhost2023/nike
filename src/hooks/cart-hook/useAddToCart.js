// hooks/cart-hook/useAddToCart.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variantId, quantity = 1 }) => {
      const { data } = await api.post("/cart", {
        productId,
        variantId,
        quantity,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

// hooks/cart-hook/useClearCart.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete("/cart?clearAll=true");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

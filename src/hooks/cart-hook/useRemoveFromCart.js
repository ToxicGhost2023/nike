// hooks/cart-hook/useRemoveFromCart.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId) => {
      const { data } = await api.delete(`/cart?itemId=${itemId}`);
      return data;
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item._id !== itemId),
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["cart"], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

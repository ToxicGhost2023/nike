// hooks/cart-hook/useUpdateCart.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const { data } = await api.patch("/cart", { itemId, quantity });
      return data;
    },
    // Optimistic update
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries(["cart"]);
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
          ),
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

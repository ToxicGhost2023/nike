import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    },
    enabled: !!id,
  });
};

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { api } from "@/lib/api";

export const useProducts = () => {
  const { search, filters } = useSelector((state) => state.products);

  return useQuery({
    queryKey: ["products", search, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("limit", "100");

      if (search) params.set("search", search);

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "" && value !== false) {
          params.set(key, String(value));
        }
      });

      const { data } = await api.get(`/products?${params}`);
      return data;
    },
    keepPreviousData: true,
  });
};

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ["products", "filterOptions"],
    queryFn: async () => {
      const { data } = await api.get("/products?limit=1000");
      return data.products;
    },
    staleTime: 5 * 60 * 1000,
    select: (products) => {
      const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
      const categories = [
        ...new Set(products.map((p) => p.category).filter(Boolean)),
      ];
      const colors = [
        ...new Set(
          products.flatMap(
            (p) => p.variants?.map((v) => v.colorName).filter(Boolean) || []
          )
        ),
      ];

      return { brands, categories, colors, products };
    },
  });
};

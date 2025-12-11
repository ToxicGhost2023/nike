"use client";

import { useState } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/product-hook/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PackageX } from "lucide-react";
import ProductView from "./ProductsView";

export default function ProductsList() {
  const { data, isLoading, isError } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = data?.products || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <PackageX className="w-16 h-16 text-zinc-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Failed to load products</h3>
        <p className="text-zinc-500">Please try again later</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <PackageX className="w-16 h-16 text-zinc-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">No products found</h3>
        <p className="text-zinc-500">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4">
        {products.map((product) => {
          const mainVariant = product.variants?.[0] || {};
          const price = mainVariant.finalPrice || mainVariant.price || 0;

          return (
            <div
              key={product._id}
              className="
              group relative flex flex-col overflow-hidden
              rounded-3xl border border-zinc-100 bg-white
              transition-all duration-300
              hover:border-zinc-300 hover:-translate-y-1
            "
            >
              {/* نوار گرادیانی بالای کارت */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-zinc-900 via-zinc-500 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Image Container – نسخه واضح‌تر */}
              <div className="relative overflow-hidden">
                <div className="relative w-full h-64 bg-zinc-50 flex items-center justify-center">
                  <Image
                    width={400}
                    height={400}
                    src={product.mainImage || "/placeholder.png"}
                    alt={product.title}
                    priority={false}
                    className="
                    w-full h-full object-contain
                    transition-transform duration-500
                    group-hover:scale-[1.03]
                  "
                  />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {mainVariant.discount > 0 && (
                    <Badge className="bg-red-500/90 text-[11px] tracking-wide rounded-full px-2.5 py-0.5">
                      {mainVariant.discount}% OFF
                    </Badge>
                  )}

                  {product.bestSeller && (
                    <Badge className="bg-amber-500/90 text-[11px] tracking-wide rounded-full px-2.5 py-0.5">
                      Best Seller
                    </Badge>
                  )}
                </div>

                {/* Quick View Button */}
                <Button
                  size="icon"
                  className="
                  absolute top-4 right-4 rounded-full bg-white/95 text-zinc-800
                  border border-zinc-200
                  opacity-0 translate-y-2
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300
                  hover:bg-zinc-900 hover:text-white
                "
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              {/* Details */}
              <div className="px-5 pb-5 pt-3 flex flex-col flex-1">
                <p className="text-[11px] text-emerald-500 font-semibold tracking-[0.18em] uppercase mb-1">
                  {product.brand}
                </p>

                <h3 className="font-semibold text-[15px] text-zinc-900 mb-0.5 line-clamp-1">
                  {product.title}
                </h3>

                <p className="text-xs text-zinc-500 mb-3 line-clamp-1">
                  {product.model}
                </p>

                <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-zinc-900">
                      ${price.toLocaleString()}
                    </span>
                    {mainVariant.discount > 0 && (
                      <span className="text-xs text-zinc-400 line-through">
                        ${mainVariant.price}
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="
                    rounded-full px-4 h-9 text-xs font-medium
                    border-zinc-200 text-zinc-800
                    hover:bg-zinc-900 hover:text-white hover:border-zinc-900
                    transition-colors duration-200
                  "
                    onClick={() => setSelectedProduct(product)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProductView
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

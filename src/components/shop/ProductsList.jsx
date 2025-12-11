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
              className="group border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden p-4">
                <Image
                  width={200}
                  height={200}
                  src={product.mainImage || "/placeholder.png"}
                  alt={product.title}
                  priority={false}
                  className="w-full h-full object-contain rounded-3xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                {mainVariant.discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    {mainVariant.discount}% OFF
                  </Badge>
                )}

                {product.bestSeller && (
                  <Badge className="absolute top-4 left-4 bg-amber-500">
                    Best Seller
                  </Badge>
                )}

                {/* Quick View Button */}
                <Button
                  size="icon"
                  className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye className="w-5 h-5" />
                </Button>
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-[#16db65] font-bold uppercase mb-1">
                  {product.brand}
                </p>
                <h3 className="font-bold text-lg mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-600 font-medium mb-2">
                  {product.model}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-orange-600">
                      ${price.toLocaleString()}
                    </span>
                    {mainVariant.discount > 0 && (
                      <span className="text-sm text-zinc-400 line-through ml-2">
                        ${mainVariant.price}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
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

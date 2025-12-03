"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/Slice/productSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ProductView from "./ProductsView";
import Image from "next/image";

export default function ProductsList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-96 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="w-full  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4">
        {products?.map((product) => {
          const mainVariant = product.variants?.[0] || {};
          const price = mainVariant.finalPrice || mainVariant.price || 0;

          return (
            <div
              key={product._id}
              className="group  border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative   overflow-hidden p-4">
                <Image
                  width={200}
                  height={200}
                  src={product.mainImage || "/placeholder.png"}
                  alt={product.title}
                  priority={false}
                  className="w-full h-full object-contain rounded-3xl  transition-transform duration-500"
                />

                {/* Badges */}
                {mainVariant.discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    {mainVariant.discount}% OFF
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
                <p className="text-xs text-green font-bold uppercase mb-1">
                  {product.brand}
                </p>
                <p className="text-xs text-gray-600 font-bold uppercase mb-1">
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
                    Buy
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

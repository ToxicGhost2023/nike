"use client";

import { getAllProducts } from "@/store/Slice/productSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  ArrowRight,
  Star,
  EyeIcon,
  Heart,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductView from "./ProductsView";

export default function ProductsList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  if (loading) {
    return (
      <section className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid gap-8 md:gap-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex flex-col md:flex-row">
                <Skeleton className="w-full md:w-5/12 lg:w-4/12 aspect-square" />
                <div className="flex-1 p-6 md:p-12 space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-14 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 md:py-32 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">😔</div>
          <h3 className="text-2xl md:text-3xl font-black mb-4">
            محصولی یافت نشد
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            لطفاً فیلترها یا جستجوی خود را تغییر دهید
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* تعداد محصولات */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-[#16db65] text-lg md:text-xl">
              {products.length}
            </span>{" "}
            محصول یافت شد
          </div>
        </div>

        {/* لیست محصولات */}
        <div className="grid gap-8 md:gap-12">
          {products?.map((product) => {
            const currentVariant = product.variants?.[0];
            const price =
              currentVariant?.finalPrice || currentVariant?.price || 0;
            const isDiscounted = currentVariant?.discount > 0;

            return (
              <div
                key={product._id}
                className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl 
                  bg-white dark:bg-zinc-900 
                  border-2 border-zinc-200 dark:border-zinc-800 
                  hover:border-[#16db65] hover:shadow-2xl hover:shadow-[#16db65]/10
                  transition-all duration-500"
              >
                {/* تصویر محصول */}
                <div className="relative w-full md:w-5/12 lg:w-4/12 aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  {/* بج‌ها */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.bestSeller && (
                      <Badge className="bg-white text-black font-black shadow-lg flex items-center gap-1 px-3 py-1.5">
                        <TrendingUp size={14} />
                        پرفروش
                      </Badge>
                    )}
                    {isDiscounted && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-black shadow-lg px-3 py-1.5">
                        {currentVariant.discount}% تخفیف
                      </Badge>
                    )}
                  </div>

                  {/* دکمه علاقه‌مندی */}
                  <button
                    className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white dark:bg-zinc-900 
                    shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart
                      size={20}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-red-500 hover:fill-red-500 transition-colors"
                    />
                  </button>

                  {/* تصویر */}
                  <img
                    src={product.mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* محتوا */}
                <div className="flex-1 p-6 md:p-12 flex flex-col justify-between">
                  <div>
                    {/* برند و امتیاز */}
                    <div className="flex justify-between items-start mb-4">
                      <Badge
                        variant="outline"
                        className="text-[#16db65] border-[#16db65] font-black px-4 py-1.5 text-sm"
                      >
                        {product.brand}
                      </Badge>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full">
                        <Star
                          size={16}
                          fill="#eab308"
                          className="text-yellow-500"
                        />
                        <span className="text-sm font-bold">4.8</span>
                      </div>
                    </div>

                    {/* عنوان */}
                    <h2
                      className="text-3xl md:text-4xl lg:text-5xl font-black mt-2 mb-3 
                      group-hover:text-[#16db65] transition-colors line-clamp-2"
                    >
                      {product.title}
                    </h2>

                    {/* مدل */}
                    <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 mb-6">
                      سری {product.model}
                    </p>

                    {/* رنگ‌ها */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mt-6 flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                          رنگ‌ها:
                        </span>
                        <div className="flex gap-2">
                          {product.variants?.slice(0, 5).map((v, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-md hover:scale-125 transition-transform"
                              style={{ backgroundColor: v.colorCode }}
                              title={v.colorName}
                            />
                          ))}
                          {product.variants.length > 5 && (
                            <div
                              className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 
                              flex items-center justify-center text-xs font-bold text-zinc-500"
                            >
                              +{product.variants.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* قیمت و دکمه‌ها */}
                  <div
                    className="mt-8 md:mt-10 pt-6 md:pt-8 border-t-2 border-zinc-200 dark:border-zinc-800 
                    flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
                  >
                    {/* قیمت */}
                    <div>
                      <span className="text-xs md:text-sm uppercase text-zinc-400 tracking-wider font-bold block mb-2">
                        قیمت
                      </span>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-4xl md:text-5xl font-black text-[#16db65]">
                          ${price.toLocaleString()}
                        </span>
                        {isDiscounted && (
                          <span className="text-xl md:text-2xl text-zinc-400 line-through">
                            ${currentVariant.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="flex gap-3 w-full lg:w-auto">
                      <Button
                        className="flex-1 lg:flex-initial bg-[#16db65] hover:bg-[#12b541] text-white font-bold 
                          px-6 md:px-10 h-14 md:h-16 rounded-xl shadow-lg hover:shadow-xl 
                          transition-all group/btn"
                      >
                        <ShoppingBag size={20} className="ml-2" />
                        <span className="hidden sm:inline">افزودن به سبد</span>
                        <span className="sm:hidden">خرید</span>
                        <ArrowRight
                          size={20}
                          className="mr-2 group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Button>

                      <Button
                        onClick={() => openQuickView(product)}
                        variant="outline"
                        className="px-4 md:px-6 h-14 md:h-16 border-2 border-zinc-300 dark:border-zinc-700 
                          hover:border-[#16db65] hover:bg-[#16db65]/5 rounded-xl transition-all"
                      >
                        <EyeIcon size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* مودال نمایش سریع */}
      <ProductView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

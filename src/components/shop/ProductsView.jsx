"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  ExternalLink,
  Star,
  Check,
  TrendingUp,
  X,
} from "lucide-react";

export default function ProductView({ product, isOpen, onClose }) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) return null;

  const currentVariant =
    product.variants?.[selectedVariant] || product.variants?.[0];
  const price = currentVariant?.finalPrice || currentVariant?.price || 0;
  const isDiscounted = currentVariant?.discount > 0;

  const goToProductPage = () => {
    onClose();
    router.push(`/shop/${product._id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* تصویر محصول */}
          <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
            {/* بج‌ها */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.bestSeller && (
                <Badge className="bg-white text-black font-black shadow-lg flex items-center gap-1">
                  <TrendingUp size={14} />
                  پرفروش
                </Badge>
              )}
              {isDiscounted && (
                <Badge className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-black">
                  {currentVariant.discount}% discount
                </Badge>
              )}
            </div>

            {/* دکمه بستن */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 
                shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
            >
              <X size={20} />
            </button>

            <img
              src={product.mainImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* اطلاعات محصول */}
          <div className="p-6 md:p-10 flex flex-col">
            {/* هدر */}
            <div className="flex justify-between items-start mb-6">
              <Badge
                variant="outline"
                className="text-[#16db65] border-[#16db65] font-black px-4 py-1.5"
              >
                {product.brand}
              </Badge>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full">
                <Star size={16} fill="#eab308" className="text-yellow-500" />
                <span className="text-sm font-bold">4.8</span>
              </div>
            </div>

            {/* عنوان */}
            <DialogHeader className="mb-4">
              <DialogTitle className="text-3xl md:text-4xl font-black text-right">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {/* مدل */}
            <p className="flex gap-2  text-lg text-zinc-500 dark:text-zinc-400 mb-6">
              <span className="text-orange-500 font-bold rounded-md   ">
                model:
              </span>
              {product.model}
            </p>

            {/* قیمت */}
            <div className="mb-8 pb-6 border-b-2 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-black text-[#16db65]">
                  ${price.toLocaleString()}
                </span>
                {isDiscounted && (
                  <span className="text-2xl text-zinc-400 line-through">
                    ${currentVariant.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* انتخاب رنگ */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-8">
                <label className="block text-sm font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-4">
                  choose color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`
                        relative w-14 h-14 rounded-xl shadow-md hover:shadow-lg transition-all
                        border-4 transform hover:scale-110
                        ${
                          selectedVariant === index
                            ? "border-[#16db65] ring-4 ring-[#16db65]/30 scale-110"
                            : "border-white dark:border-zinc-800"
                        }
                      `}
                      style={{ backgroundColor: variant.colorCode }}
                      title={variant.colorName}
                    >
                      {selectedVariant === index && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check
                            size={24}
                            className="text-white drop-shadow-lg"
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {currentVariant && (
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-bold">
                      {currentVariant.colorName}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* موجودی */}
            {currentVariant && (
              <div className="mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    count:
                  </span>
                  <span
                    className={`font-bold ${
                      currentVariant.stock > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {currentVariant.stock > 0
                      ? `${currentVariant.stock} `
                      : "nothing"}
                  </span>
                </div>
              </div>
            )}

            {/* دکمه‌ها */}
            <div className="mt-auto space-y-3">
              <Button
                onClick={goToProductPage}
                className="w-full bg-[#16db65] hover:bg-[#12b541] text-white font-bold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <ExternalLink size={20} className="ml-2" />
                Go to Deatails
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-[#16db65] text-[#16db65] hover:bg-[#16db65] hover:text-white font-bold h-14 rounded-xl transition-all"
              >
                <ShoppingBag size={20} className="ml-2" />
                Add to shopping cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

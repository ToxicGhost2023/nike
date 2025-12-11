// components/shop/ProductView.jsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/cart-hook/useAddToCart";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  BookImage,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductView({ product, isOpen, onClose }) {
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState("");

  const addToCart = useAddToCart();

  // Reset on product change
  useEffect(() => {
    if (product) {
      setSelectedVariantIndex(0);
      setJustAdded(false);
      setError("");
      const firstImage =
        product.variants?.[0]?.images?.[0] || product.mainImage;
      setActiveImage(firstImage);
    }
  }, [product]);

  // Update image on variant change
  useEffect(() => {
    if (product?.variants?.[selectedVariantIndex]) {
      const variantImages = product.variants[selectedVariantIndex].images;
      if (variantImages?.length > 0) {
        setActiveImage(variantImages[0]);
      } else {
        setActiveImage(product.mainImage);
      }
    }
  }, [selectedVariantIndex, product]);

  if (!product) return null;

  const currentVariant = product.variants?.[selectedVariantIndex];
  const gallery =
    currentVariant?.images?.length > 0
      ? currentVariant.images
      : [product.mainImage];

  const price = currentVariant?.finalPrice || currentVariant?.price || 0;
  const isOutOfStock = !currentVariant || currentVariant.stock <= 0;

  const handleNextImage = () => {
    const currentIndex = gallery.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % gallery.length;
    setActiveImage(gallery[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = gallery.indexOf(activeImage);
    const prevIndex =
      currentIndex === 0 ? gallery.length - 1 : currentIndex - 1;
    setActiveImage(gallery[prevIndex]);
  };

  const handleAddToCart = async () => {
    if (!product || !currentVariant) return;
    setError("");

    try {
      await addToCart.mutateAsync({
        productId: product._id,
        variantId: currentVariant._id,
        quantity: 1,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to cart");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden rounded-3xl h-[90vh] md:h-[600px] flex flex-col md:flex-row bg-white dark:bg-zinc-950 border shadow-2xl">
        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 h-[45%] md:h-full relative flex flex-col bg-zinc-50 dark:bg-zinc-900">
          <div className="flex-1 relative flex items-center justify-center p-4 group">
            <Image
              width={500}
              height={500}
              src={activeImage || product.mainImage}
              alt={product.title}
              className="max-w-full max-h-full object-contain"
            />

            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="h-20 px-4 pb-4 flex items-center gap-2 overflow-x-auto">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                    activeImage === img
                      ? "border-[#16db65] scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    width={56}
                    height={56}
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 h-[55%] md:h-full p-6 overflow-y-auto relative flex flex-col">
          <DialogClose className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full">
            <X className="w-5 h-5" />
          </DialogClose>

          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {product.brand}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black">{product.title}</h2>
            <p className="text-zinc-500">{product.model}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl w-fit">
            <span className="text-2xl font-bold text-[#16db65]">
              ${price.toLocaleString()}
            </span>
            {currentVariant?.discount > 0 && (
              <>
                <span className="text-lg text-zinc-400 line-through">
                  ${currentVariant.price}
                </span>
                <Badge variant="destructive">
                  {currentVariant.discount}% OFF
                </Badge>
              </>
            )}
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <label className="text-sm font-bold text-zinc-600 block mb-3">
                Select Color
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 flex items-center gap-2 transition-all",
                      selectedVariantIndex === idx
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: variant.colorCode }}
                    />
                    {variant.colorName || variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
              <span className="text-xs text-zinc-500">Size</span>
              <div className="font-bold">{currentVariant?.size || "N/A"}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
              <span className="text-xs text-zinc-500">Status</span>
              <div
                className={cn(
                  "font-bold",
                  isOutOfStock ? "text-red-500" : "text-green-500"
                )}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : `${currentVariant.stock} In Stock`}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {justAdded && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Added to cart successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-auto">
            <Button variant="outline" className="flex-1 h-12" asChild>
              <Link href={`/shop/${product._id}`}>
                <BookImage className="mr-2 w-5 h-5" />
                Details
              </Link>
            </Button>

            <Button
              className={cn(
                "flex-[2] h-12",
                justAdded
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-600 hover:bg-orange-700"
              )}
              disabled={isOutOfStock || addToCart.isPending}
              onClick={handleAddToCart}
            >
              {addToCart.isPending ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : justAdded ? (
                <>
                  <Check className="mr-2 w-5 h-5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

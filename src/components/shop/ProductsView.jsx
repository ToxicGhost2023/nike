"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/cart-hook/useAddToCart";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductView({ product, isOpen, onClose }) {
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState("");

  const addToCart = useAddToCart();

  // اول همه هوک‌ها — همیشه در همین ترتیب
  useEffect(() => {
    if (!product) {
      setActiveImage("");
      return;
    }

    setSelectedVariantIndex(0);
    setJustAdded(false);
    setError("");

    const currentVariant = product.variants?.[0] || {};
    const gallery =
      currentVariant.images?.length > 0
        ? currentVariant.images
        : product.mainImage
        ? [product.mainImage]
        : [];

    setActiveImage(gallery[0] || "/placeholder.jpg");
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const currentVariant = product.variants?.[selectedVariantIndex] || {};
    const gallery =
      currentVariant.images?.length > 0
        ? currentVariant.images
        : product.mainImage
        ? [product.mainImage]
        : [];

    if (gallery.length > 0) {
      setActiveImage(gallery[0]);
    }
  }, [selectedVariantIndex, product]);

  // اگر product نباشه، اصلاً چیزی رندر نکن
  if (!product || !isOpen) return null;

  // حالا دیگه مطمئنیم product وجود داره
  const currentVariant = product.variants?.[selectedVariantIndex] || {};
  const price = currentVariant.finalPrice || currentVariant.price || 0;
  const originalPrice = currentVariant.price;
  const hasDiscount =
    currentVariant.finalPrice && currentVariant.finalPrice < originalPrice;
  const isOutOfStock = (currentVariant.stock ?? 0) <= 0;

  const gallery =
    currentVariant.images?.length > 0
      ? currentVariant.images
      : product.mainImage
      ? [product.mainImage]
      : [];

  const handlePrevImage = () => {
    const idx = gallery.indexOf(activeImage);
    const prev = idx === 0 ? gallery.length - 1 : idx - 1;
    setActiveImage(gallery[prev]);
  };

  const handleNextImage = () => {
    const idx = gallery.indexOf(activeImage);
    const next = (idx + 1) % gallery.length;
    setActiveImage(gallery[next]);
  };

  const handleAddToCart = async () => {
    setError("");
    try {
      await addToCart.mutateAsync({
        productId: product._id,
        variantId: currentVariant._id,
        quantity: 1,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2200);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to cart");
      setTimeout(() => setError(""), 4000);
    }
  };

  const hexToRgba = (hex, alpha) => {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch {
      return `rgba(255, 255, 255, ${alpha})`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div className="flex flex-col md:flex-row bg-white/95 backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/40 shadow-2xl">
          <div
            className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center transition-all duration-500"
            style={{
              background: currentVariant.colorCode
                ? `linear-gradient(135deg, ${hexToRgba(
                    currentVariant.colorCode,
                    0.08
                  )} 0%, ${hexToRgba(
                    currentVariant.colorCode,
                    0.03
                  )} 50%, rgba(255,255,255,0.95) 100%)`
                : "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
            }}
          >
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-4/5 h-4/5 rounded-full blur-3xl opacity-40 transition-all duration-700"
                  style={{
                    backgroundColor: currentVariant.colorCode || "transparent",
                  }}
                />
              </div>

              <div className="relative z-10 w-full h-full">
                <Image
                  src={activeImage || product.image}
                  alt={product.model}
                  fill
                  className="object-contain p-8 transition-all duration-500"
                  priority
                />
              </div>

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 transition-all z-20"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 transition-all z-20"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-8 flex gap-3 overflow-x-auto scrollbar-hide max-w-full px-4">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300",
                      activeImage === img
                        ? "border-gray-900 scale-105 shadow-md"
                        : "border-gray-200/70 hover:border-gray-400 backdrop-blur-sm"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* محتوا */}
          <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col justify-between bg-white/95 backdrop-blur-xl">
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-4">
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                  <span className="text-xs font-medium tracking-wider text-gray-700">
                    {product.brand?.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight leading-snug">
                  {product.model}
                </h1>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-light text-gray-900">
                    ${price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                      ${originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                    Save ${(originalPrice - price).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-all duration-300"
                    style={{
                      backgroundColor: currentVariant.colorCode || "#ccc",
                    }}
                  />
                  <p className="text-sm text-gray-700 font-medium">
                    Color:{" "}
                    <span className="text-gray-900 font-semibold">
                      {currentVariant.colorName ||
                        currentVariant.color ||
                        "Select a color"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.variants?.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={cn(
                        "group relative w-14 h-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md",
                        selectedVariantIndex === idx
                          ? "border-gray-900 scale-110 shadow-md"
                          : "border-gray-200 hover:border-gray-400 hover:scale-105"
                      )}
                      title={variant.colorName || variant.color}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-white/70 shadow-inner"
                        style={{ backgroundColor: variant.colorCode || "#ccc" }}
                      />
                      {selectedVariantIndex === idx && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center p-1 shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      )}

                      {/* Hover effect */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        style={{ backgroundColor: variant.colorCode || "#ccc" }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {isOutOfStock && (
                <div className="mb-6 p-4 bg-gray-100/80 backdrop-blur-sm rounded-xl">
                  <p className="text-gray-600 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Currently unavailable
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 rounded-r-xl">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {justAdded && (
                <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border-l-4 border-green-400 rounded-r-xl">
                  <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Added to cart successfully
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-all duration-300"
                asChild
              >
                <Link href={`/shop/${product._id}`}>View Details</Link>
              </Button>

              <Button
                size="lg"
                disabled={isOutOfStock || addToCart.isPending}
                onClick={handleAddToCart}
                className={cn(
                  "h-14 rounded-xl font-medium transition-all duration-300 relative overflow-hidden",
                  justAdded
                    ? "bg-gray-900 hover:bg-gray-800"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                )}
              >
                {/* Animated background effect */}
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300"
                  style={{
                    backgroundColor: currentVariant.colorCode || "#fff",
                  }}
                />

                <div className="relative z-10 flex items-center justify-center gap-2">
                  {addToCart.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : justAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

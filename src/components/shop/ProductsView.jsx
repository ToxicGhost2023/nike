"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  BookImage,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/Slice/cartSlice";

export default function ProductView({ product, isOpen, onClose }) {
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        variantId: currentVariant._id,
        quantity: 1,
      })
    );
  };

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariantIndex(0);
      const firstImage =
        product.variants?.[0]?.images?.[0] || product.mainImage;
      setActiveImage(firstImage);
    }
  }, [product]);

  // Update image when variant changes
  useEffect(() => {
    if (product && product.variants[selectedVariantIndex]) {
      const variantImages = product.variants[selectedVariantIndex].images;
      if (variantImages && variantImages.length > 0) {
        setActiveImage(variantImages[0]);
      } else {
        setActiveImage(product.mainImage);
      }
    }
  }, [selectedVariantIndex, product]);

  if (!product) return null;

  const currentVariant = product.variants[selectedVariantIndex];
  const gallery =
    currentVariant?.images?.length > 0
      ? currentVariant.images
      : [product.mainImage];

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden rounded-3xl h-[90vh] md:h-[600px] flex flex-col md:flex-row bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-white/20 shadow-2xl">
        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-1/2 h-[45%] md:h-full relative flex flex-col bg-white/30 dark:bg-black/20">
          {/* Main Image Area */}
          <div className="flex-1 relative flex items-center justify-center p-4 group">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                width={500}
                height={500}
                src={activeImage}
                alt={product.title}
                className="max-w-full max-h-full object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Navigation Arrows - Glass Style */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/90 transition shadow-lg text-zinc-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/90 transition shadow-lg text-zinc-800"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails - Glass Border */}
          {gallery.length > 1 && (
            <div className="h-24 px-4 flex items-center gap-3 overflow-x-auto border-t border-white/20 bg-white/10 backdrop-blur-sm">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all shadow-sm",
                    activeImage === img
                      ? "border-blue-600 opacity-100 ring-2 ring-blue-600/20 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                  )}
                >
                  <Image
                    width={100}
                    height={100}
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                    priority={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 h-[55%] md:h-full p-6 md:p-8 overflow-y-auto relative flex flex-col bg-white/40 dark:bg-black/20">
          <DialogClose
            className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 rounded-full transition"
            onClick={onClose}
          ></DialogClose>

          <div className="mb-6">
            <Badge variant="outline" className="mb-2 border-zinc-400/50">
              {product.brand}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-800 dark:text-zinc-100 mt-1">
              {product.title}
            </h2>
            <p className="text-zinc-500 font-medium">{product.model}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-8 bg-white/50 dark:bg-black/30 p-4 rounded-2xl w-fit backdrop-blur-sm">
            <span className="text-3xl font-bold text-green-600">
              ${currentVariant.finalPrice.toLocaleString()}
            </span>
            {currentVariant.discount > 0 && (
              <>
                <span className="text-lg text-zinc-400 line-through decoration-2">
                  ${currentVariant.price}
                </span>
                <Badge
                  variant="destructive"
                  className="text-sm font-bold shadow-md"
                >
                  {currentVariant.discount}% OFF
                </Badge>
              </>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="text-sm font-bold text-zinc-600 dark:text-zinc-300 block mb-3 uppercase tracking-wider">
              Select Color
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={cn(
                    "px-4 py-2 rounded-xl border-2 flex items-center gap-2 transition-all font-medium",
                    selectedVariantIndex === idx
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-lg scale-105"
                      : "border-zinc-200/60 bg-white/50 hover:border-zinc-300 hover:bg-white"
                  )}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: variant.colorCode }}
                  />
                  {variant.color}
                </button>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-sm">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Size
              </span>
              <div className="text-xl font-black mt-1">
                {currentVariant.size}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-sm">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Status
              </span>
              <div
                className={cn(
                  "text-xl font-black mt-1",
                  currentVariant.stock > 0 ? "text-emerald-600" : "text-red-500"
                )}
              >
                {currentVariant.stock > 0 ? "In Stock" : "Sold Out"}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-3 mt-auto pt-4">
            <Button
              variant="outline"
              className="flex-1 h-14 text-lg font-bold rounded-xl border-2 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 bg-transparent"
              disabled={currentVariant.stock <= 0}
            >
              <BookImage className="mr-2 w-5 h-5" />
              <Link prefetch={true} href={`/shop/${product._id}`}>
                Details
              </Link>
            </Button>
            <Button
              className="flex-[2] h-14 text-lg font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20"
              disabled={currentVariant.stock <= 0}
              onClick={() => handleAddToCart()}
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              {currentVariant.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

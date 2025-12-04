"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductById,
  clearCurrentProduct,
} from "@/store/Slice/productSlice";
import {
  ShoppingBag,
  Heart,
  Share2,
  Star,
  Check,
  TrendingUp,
  Shield,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function ProductsDetails() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    currentProduct: product,
    loadingProduct: loading,
    errorProduct: error,
  } = useSelector((state) => state.products);

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [allImages, setAllImages] = useState([]);

  console.log(allImages);

  // دریافت محصول از API
  useEffect(() => {
    if (params.id) {
      dispatch(getProductById(params.id));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [params.id, dispatch]);

  useEffect(() => {
    if (!product || !product.variants) return;

    const images = [];

    // عکس اصلی
    if (product.mainImage) {
      images.push(product.mainImage);
    }

    // عکس‌های همون رنگ انتخاب‌شده اول بیان
    const selected = product.variants[selectedVariant];
    if (selected?.images?.length) {
      selected.images.forEach((img) => {
        if (!images.includes(img)) images.push(img);
      });
    }

    // بعد عکس‌های بقیه رنگ‌ها
    product.variants.forEach((variant, i) => {
      if (i !== selectedVariant && variant.images?.length) {
        variant.images.forEach((img) => {
          if (!images.includes(img)) images.push(img);
        });
      }
    });

    setAllImages(images);
    setSelectedImage(0);
  }, [product, selectedVariant]);

  // Navigation بین عکس‌ها
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-3xl" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500" size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Product Not Found
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            {error || "The product you're looking for doesn't exist"}
          </p>
          <Button
            onClick={() => router.push("/shop")}
            className="bg-[#16db65] hover:bg-[#12b541] text-white font-bold h-14 px-8 rounded-xl"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  const currentVariant =
    product.variants?.[selectedVariant] || product.variants?.[0];
  const price = currentVariant?.finalPrice || currentVariant?.price || 0;
  const isDiscounted = currentVariant?.discount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Breadcrumb */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pt-8">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          <Link
            href="/shop"
            className="hover:text-[#16db65] transition-colors font-medium"
          >
            Store
          </Link>
          <ChevronRight size={16} />
          <span className="text-zinc-400 dark:text-zinc-600">
            {product.category || "Products"}
          </span>
          <ChevronRight size={16} />
          <span className="text-zinc-900 dark:text-white font-bold truncate max-w-[200px]">
            {product.title}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-950 rounded-3xl overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {product.bestSeller && (
                  <Badge className="bg-white text-black font-black shadow-lg flex items-center gap-1 px-3 py-1.5">
                    <TrendingUp size={14} />
                    Best Seller
                  </Badge>
                )}
                {isDiscounted && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-black px-3 py-1.5">
                    {currentVariant?.discount}% OFF
                  </Badge>
                )}
              </div>

              {/* Navigation Arrows */}
              {allImages?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-zinc-900/90 
                      rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform
                      opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-zinc-900/90 
                      rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform
                      opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {allImages?.length > 1 && (
                <div className="absolute bottom-6 right-6 z-10 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold">
                  {selectedImage} / {allImages.length}
                </div>
              )}

              <Image
                width={800}
                height={800}
                priority
                src={allImages[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Thumbnails */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-3">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      aspect-square rounded-xl overflow-hidden border-4 transition-all
                      ${
                        selectedImage === index
                          ? "border-[#16db65] ring-4 ring-[#16db65]/30 scale-105"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }
                    `}
                  >
                    <Image
                      width={200}
                      height={200}
                      priority
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <Badge
                variant="outline"
                className="text-[#16db65] border-[#16db65] font-black px-4 py-1.5 mb-4"
              >
                {product.brand}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight">
                {product.title}
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-4">
                {product.model} Series
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill="#eab308"
                      className="text-yellow-500"
                    />
                  ))}
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  (248 Reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b-2 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl md:text-5xl font-black text-[#16db65]">
                  ${price.toLocaleString()}
                </span>
                {isDiscounted && (
                  <span className="text-2xl md:text-3xl text-zinc-400 line-through">
                    ${currentVariant.price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Tax included
              </p>
            </div>

            {/* Color Selection */}
            {product?.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-4 tracking-wider">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product?.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`
                        relative w-14 h-14 md:w-16 md:h-16 rounded-xl shadow-md hover:shadow-lg transition-all
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
                <p className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">
                  {currentVariant?.colorName}
                  {currentVariant?.size && ` - Size: ${currentVariant.size}`}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  Availability:
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      currentVariant?.stock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`font-black text-sm ${
                      currentVariant?.stock > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {currentVariant?.stock > 0
                      ? `${currentVariant.stock} In Stock`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-4 tracking-wider">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl border-2 hover:border-[#16db65] hover:text-[#16db65]"
                >
                  -
                </Button>
                <span className="text-2xl font-black w-16 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(
                      Math.min(currentVariant?.stock || 1, quantity + 1)
                    )
                  }
                  disabled={quantity >= (currentVariant?.stock || 0)}
                  className="w-12 h-12 rounded-xl border-2 hover:border-[#16db65] hover:text-[#16db65]"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <Button
                disabled={!currentVariant || currentVariant.stock === 0}
                className="w-full bg-[#16db65] hover:bg-[#12b541] text-white font-bold h-16 rounded-xl 
                  shadow-lg hover:shadow-xl transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!currentVariant || currentVariant.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingBag size={24} className="mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-14 rounded-xl border-2 font-bold hover:border-[#16db65] hover:text-[#16db65]"
                >
                  <Heart size={20} className="mr-2" />
                  Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="h-14 rounded-xl border-2 font-bold hover:border-[#16db65] hover:text-[#16db65]"
                >
                  <Share2 size={20} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#16db65]/10 flex items-center justify-center flex-shrink-0">
                  <Truck size={24} className="text-[#16db65]" />
                </div>
                <div>
                  <p className="font-bold text-sm">Free Shipping</p>
                  <p className="text-xs text-zinc-500">Orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#16db65]/10 flex items-center justify-center flex-shrink-0">
                  <RotateCcw size={24} className="text-[#16db65]" />
                </div>
                <div>
                  <p className="font-bold text-sm">Easy Returns</p>
                  <p className="text-xs text-zinc-500">30-day return</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#16db65]/10 flex items-center justify-center flex-shrink-0">
                  <Shield size={24} className="text-[#16db65]" />
                </div>
                <div>
                  <p className="font-bold text-sm">Warranty</p>
                  <p className="text-xs text-zinc-500">2 years</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-4">About Product</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t-2 border-zinc-200 dark:border-zinc-800 pt-6">
              <h4 className="text-lg font-bold mb-4">Product Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Brand:
                  </span>
                  <p className="font-bold">{product.brand}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Model:
                  </span>
                  <p className="font-bold">{product.model}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Category:
                  </span>
                  <p className="font-bold">{product.category}</p>
                </div>
                {currentVariant?.sku && (
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      SKU:
                    </span>
                    <p className="font-bold">{currentVariant.sku}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

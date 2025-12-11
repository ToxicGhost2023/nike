// app/cart/page.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  CreditCard,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdateCart } from "@/hooks/cart-hook/useUpdateCart";
import { useRemoveFromCart } from "@/hooks/cart-hook/useRemoveFromCart";
import { useClearCart } from "@/hooks/cart-hook/useClearCart";
import { useCart } from "@/hooks/cart-hook/useCart";

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading, isError } = useCart();
  const updateCart = useUpdateCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const [updatingItems, setUpdatingItems] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  const subtotal = items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.09;
  const total = subtotal + shipping + tax;

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

    try {
      await updateCart.mutateAsync({ itemId, quantity: newQuantity });
    } catch (error) {
      showMessage("error", error.response?.data?.error || "Failed to update");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart.mutateAsync(itemId);
      showMessage("success", "Item removed from cart");
    } catch {
      showMessage("error", "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      showMessage("success", "Cart cleared");
    } catch {
      showMessage("error", "Failed to clear cart");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to load cart</h2>
          <Button onClick={() => router.refresh()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-zinc-400" />
          </div>
          <h2 className="text-3xl font-black mb-3">Your cart is empty</h2>
          <p className="text-zinc-500 mb-8">Start shopping to add items</p>
          <Button asChild size="lg" className="bg-[#16db65] hover:bg-[#12b541]">
            <Link href="/shop">
              <ShoppingBag className="mr-2" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Message */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-xl flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft />
            </Button>
            <div>
              <h1 className="text-3xl font-black">Shopping Cart</h1>
              <p className="text-zinc-500">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 border-red-200">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all items from your cart.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearCart}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {clearCart.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Clear Cart"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;
              const variant = item.variant;
              const isUpdating = updatingItems[item._id];

              return (
                <Card key={item._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                        <Image
                          src={product?.mainImage || "/placeholder.png"}
                          alt={product?.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="text-xs text-[#16db65] font-bold">
                              {product?.brand}
                            </p>
                            <h3 className="font-bold text-lg truncate">
                              {product?.title}
                            </h3>
                            <p className="text-sm text-zinc-500">
                              {product?.model}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-red-500"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {variant && (
                          <div className="flex items-center gap-2 mt-2">
                            <div
                              className="w-5 h-5 rounded-full border-2"
                              style={{ backgroundColor: variant.colorCode }}
                            />
                            <span className="text-sm text-zinc-600">
                              {variant.colorName}
                            </span>
                            {variant.size && (
                              <Badge variant="secondary">
                                Size: {variant.size}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1 || isUpdating}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-bold">
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                isUpdating ||
                                (variant && item.quantity >= variant.stock)
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-black text-[#16db65]">
                              ${(item.priceAtAdd * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-zinc-500">
                                ${item.priceAtAdd.toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-[#16db65]">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal < 50 && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                    <p className="text-xs text-zinc-500 mb-2">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#16db65]"
                        style={{ width: `${(subtotal / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Tax (9%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-[#16db65]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full h-14 bg-[#16db65] hover:bg-[#12b541] text-lg font-bold"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/shop")}
                >
                  Continue Shopping
                </Button>

                <div className="w-full pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <Truck className="w-4 h-4 text-[#16db65]" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <Shield className="w-4 h-4 text-[#16db65]" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <Package className="w-4 h-4 text-[#16db65]" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

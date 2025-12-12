"use client";

import { useState, Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/hooks/cart-hook/useCart";
import { useUpdateCart } from "@/hooks/cart-hook/useUpdateCart";
import { useRemoveFromCart } from "@/hooks/cart-hook/useRemoveFromCart";
import { useClearCart } from "@/hooks/cart-hook/useClearCart";
import {
  CartLoadingSkeleton,
  CartError,
  CartEmpty,
  CartMessage,
  CartHeader,
} from "@/components/cart";

const CartItemList = dynamic(
  () =>
    import("@/components/cart/cart-item-list").then((mod) => ({
      default: mod.CartItemList,
    })),
  {
    loading: () => <CartLoadingSkeleton />,
    ssr: false,
  }
);

const CartSummary = dynamic(
  () =>
    import("@/components/cart/cart-summary").then((mod) => ({
      default: mod.CartSummary,
    })),
  {
    loading: () => (
      <div className="h-80 bg-zinc-100 animate-pulse rounded-xl" />
    ),
    ssr: false,
  }
);

function useCartCalculations(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.09;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

function useMessage() {
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return { message, showMessage };
}

export default function CartPage() {
  const { data: cart, isLoading, isError } = useCart();
  const updateCart = useUpdateCart();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const [updatingItems, setUpdatingItems] = useState({});
  const { message, showMessage } = useMessage();

  const items = cart?.items || [];
  const isEmpty = items.length === 0;
  const { subtotal, shipping, tax, total } = useCartCalculations(items);
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
    return <CartLoadingSkeleton />;
  }

  if (isError) {
    return <CartError />;
  }

  if (isEmpty) {
    return <CartEmpty />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <CartMessage type={message.type} text={message.text} />

        <CartHeader
          itemCount={items.length}
          onClearCart={handleClearCart}
          isClearing={clearCart.isPending}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <CartItemList
            items={items}
            updatingItems={updatingItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

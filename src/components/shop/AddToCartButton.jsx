"use client";

import { useState } from "react";
import { useAddToCart } from "@/hooks/cart-hook";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  disabled = false,
  className = "",
  size = "default",
}) {
  const addToCart = useAddToCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({ productId, variantId, quantity });
      setJustAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || addToCart.isPending}
      size={size}
      className={cn(
        justAdded
          ? "bg-green-500 hover:bg-green-600"
          : "bg-[#16db65] hover:bg-[#12b541]",
        "text-white font-bold",
        className
      )}
    >
      {addToCart.isPending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Adding...
        </>
      ) : justAdded ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  );
}

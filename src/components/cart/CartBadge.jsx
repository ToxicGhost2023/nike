"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/cart-hook/useCart";

export default function CartBadge() {
  const { data: cart } = useCart();
  const itemCount = cart?.totalItems || cart?.items?.length || 0;

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/cart">
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#16db65] text-black text-xs">
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

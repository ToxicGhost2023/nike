"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { QuantitySelector } from "./quantity-selector";

export function CartItem({ item, isUpdating, onUpdateQuantity, onRemove }) {
  const { product, variant, quantity, priceAtAdd, _id } = item;

  const imageSrc =
    variant?.images?.[0] || product?.mainImage || "/placeholder.png";

  const totalPrice = (priceAtAdd * quantity).toFixed(2);
  const unitPrice = priceAtAdd.toFixed(2);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
            <Image
              src={imageSrc}
              alt={product?.title || "Product"}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex justify-between gap-2">
              <div>
                <p className="text-xs text-[#16db65] font-bold">
                  {product?.brand}
                </p>
                <p className="text-sm text-zinc-500">{product?.model}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-red-500"
                onClick={() => onRemove(_id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Variant Info */}
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
                  <Badge variant="secondary">Size: {variant.size}</Badge>
                )}
              </div>
            )}

            {/* Quantity & Price Row */}
            <div className="flex items-center justify-between mt-4">
              <QuantitySelector
                quantity={quantity}
                maxQuantity={variant?.stock}
                isUpdating={isUpdating}
                onIncrease={() => onUpdateQuantity(_id, quantity + 1)}
                onDecrease={() => onUpdateQuantity(_id, quantity - 1)}
              />

              <div className="text-right">
                <p className="text-xl font-black text-[#16db65]">
                  ${totalPrice}
                </p>
                {quantity > 1 && (
                  <p className="text-xs text-zinc-500">${unitPrice} each</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

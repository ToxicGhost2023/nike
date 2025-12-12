"use client";

import { Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantitySelector({
  quantity,
  maxQuantity,
  isUpdating,
  onIncrease,
  onDecrease,
}) {
  return (
    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onDecrease}
        disabled={quantity <= 1 || isUpdating}
      >
        <Minus className="w-4 h-4" />
      </Button>

      <span className="w-8 text-center font-bold">
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
        ) : (
          quantity
        )}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onIncrease}
        disabled={isUpdating || (maxQuantity && quantity >= maxQuantity)}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}

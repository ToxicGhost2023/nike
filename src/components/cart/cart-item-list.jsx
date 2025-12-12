"use client";

import { CartItem } from "./cart-item";

export function CartItemList({
  items,
  updatingItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          isUpdating={updatingItems[item._id]}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}

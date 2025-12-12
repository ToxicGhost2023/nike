import Link from "next/link";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmpty() {
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

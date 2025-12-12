"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Truck, Shield, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ShippingProgress({ subtotal, threshold = 50 }) {
  if (subtotal >= threshold) return null;

  const remaining = (threshold - subtotal).toFixed(2);
  const progress = (subtotal / threshold) * 100;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
      <p className="text-xs text-zinc-500 mb-2">
        Add ${remaining} more for free shipping!
      </p>
      <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#16db65] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function SummaryFeature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-500">
      <Icon className="w-4 h-4 text-[#16db65]" />
      <span>{text}</span>
    </div>
  );
}

export function CartSummary({ subtotal, shipping, tax, total }) {
  const router = useRouter();

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
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

          {/* Shipping Progress */}
          <ShippingProgress subtotal={subtotal} />

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Tax (9%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>

          <Separator />

          {/* Total */}
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

          {/* Features */}
          <div className="w-full pt-4 space-y-3">
            <SummaryFeature
              icon={Truck}
              text="Free shipping on orders over $50"
            />
            <SummaryFeature icon={Shield} text="Secure payment processing" />
            <SummaryFeature icon={Package} text="30-day return policy" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

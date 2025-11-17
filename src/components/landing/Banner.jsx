"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#70e000]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#16db65]/15 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-[#70e000]/10 rounded-full blur-[100px]" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#70e000]/30 bg-[#70e000]/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#70e000]" />
              <span className="text-xs sm:text-sm font-medium text-[#70e000]">
                New Collection 2024
              </span>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Just Do It
                <span className="block mt-2 bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  With Style
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Discover the latest Nike shoes collection. Premium quality,
                iconic design, and unmatched comfort for every athlete.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#70e000] to-[#16db65] text-black font-semibold hover:opacity-90 transition-opacity group text-base"
              >
                <Link href="/shop" className="flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#70e000]/50 hover:bg-[#70e000]/10 hover:border-[#70e000] transition-colors text-base"
              >
                <Link href="/new">View Collection</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  500+
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Products
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  50K+
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Customers
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  4.9★
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Rating
                </p>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#70e000]/20 to-[#16db65]/20 rounded-3xl blur-3xl scale-95" />
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#70e000]/10 to-[#16db65]/10 rounded-3xl" />
              <div className=" relative w-full h-full flex items-center justify-center p-8 sm:p-12">
                <Image
                  src="/images/banner.png"
                  alt="Nike Shoe"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-2xl bg-background/80 backdrop-blur-md border border-border shadow-lg animate-bounce">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#70e000]" />
              </div>

              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg">
                <p className="text-xs sm:text-sm font-semibold text-[#16db65]">
                  Limited Edition
                </p>
              </div>
            </div>

            {/* Decorative Circles */}
            <div className="absolute -z-10 top-1/4 -right-8 w-32 h-32 sm:w-40 sm:h-40 border-2 border-[#70e000]/20 rounded-full" />
            <div className="absolute -z-10 bottom-1/4 -left-8 w-24 h-24 sm:w-32 sm:h-32 border-2 border-[#16db65]/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#70e000] to-transparent opacity-50" />
    </section>
  );
}

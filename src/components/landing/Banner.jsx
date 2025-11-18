"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-[#70e000]/20 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
        <div className="absolute -top-10 -right-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-[#16db65]/15 rounded-full blur-[100px] sm:blur-[120px] animate-pulse delay-1000" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-40 sm:w-[500px] sm:h-56 lg:w-[600px] lg:h-64 bg-[#70e000]/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center relative z-10">
          {/* Text Content - چپ در دسکتاپ */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#70e000]/30 bg-[#70e000]/5 backdrop-blur-sm mx-auto lg:mx-0">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#70e000]" />
              <span className="text-xs sm:text-sm font-medium text-[#70e000]">
                New Collection 2024
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                Just Do It
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  With Style
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover the latest Nike shoes collection. Premium quality,
                iconic design, and unmatched comfort for every athlete.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#70e000] to-[#16db65] text-black font-semibold hover:opacity-90 hover:shadow-xl hover:shadow-[#70e000]/30 transition-all duration-300 group text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 shadow-lg shadow-[#70e000]/25"
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
                className="border-[#70e000]/50 hover:bg-[#70e000]/10 hover:border-[#70e000] transition-all duration-300 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8"
              >
                <Link href="/new">View Collection</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8 border-t border-border/50">
              <div className="space-y-1 text-center lg:text-left">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  500+
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Products
                </p>
              </div>
              <div className="space-y-1 text-center lg:text-left">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  50K+
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Customers
                </p>
              </div>
              <div className="space-y-1 text-center lg:text-left">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  4.9★
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Rating
                </p>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#70e000]/20 to-[#16db65]/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl scale-90 sm:scale-95 animate-pulse" />

            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#70e000]/10 via-[#70e000]/5 to-[#16db65]/10 rounded-2xl sm:rounded-3xl border border-[#70e000]/10" />
              <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/banner.png"
                    alt="Nike Shoe"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl hover:scale-110 hover:rotate-3 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
                </div>
              </div>
              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 lg:top-8 lg:right-8 p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl bg-background/90 backdrop-blur-md border border-[#70e000]/30 shadow-xl shadow-[#70e000]/20 animate-bounce hover:animate-none transition-all hover:scale-110">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#70e000] fill-[#70e000]" />
              </div>
              <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-background/90 backdrop-blur-md border border-[#16db65]/30 shadow-xl shadow-[#16db65]/20 hover:scale-105 transition-transform">
                <p className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#16db65] to-[#70e000] text-transparent bg-clip-text">
                  Limited Edition
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-2xl bg-background/90 backdrop-blur-md border border-[#70e000]/30 shadow-xl shadow-[#70e000]/20">
                <p className="text-xs text-muted-foreground">Starting at</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
                  $199
                </p>
              </div>
            </div>

            <div className="absolute -z-10 top-1/4 -right-4 sm:-right-6 lg:-right-8 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-2 border-[#70e000]/20 rounded-full animate-pulse" />
            <div className="absolute -z-10 bottom-1/4 -left-4 sm:-left-6 lg:-left-8 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 border-2 border-[#16db65]/20 rounded-full animate-pulse delay-500" />
            <div className="hidden lg:block absolute -z-10 top-10 left-10 w-2 h-2 bg-[#70e000] rounded-full animate-ping" />
            <div className="hidden lg:block absolute -z-10 bottom-20 right-10 w-2 h-2 bg-[#16db65] rounded-full animate-ping delay-300" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#70e000] to-transparent opacity-50" />
    </section>
  );
}

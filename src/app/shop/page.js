"use client";

import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowBigLeftDash } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchHeader = lazy(() => import("@/components/shop/SearchHeaders"));
const FilterProducts = lazy(() => import("@/components/shop/FilterProducts"));
const ProductsList = lazy(() => import("@/components/shop/ProductsList"));

function SearchSkeleton() {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mb-8 md:mb-12">
      <Skeleton className="w-full max-w-4xl mx-auto h-14 md:h-16 rounded-2xl" />
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border-2 border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
      <Skeleton className="h-8 w-32 mb-8" />
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsListSkeleton() {
  return (
    <div className="grid gap-8 md:gap-12">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border-2"
        >
          <div className="flex flex-col md:flex-row">
            <Skeleton className="w-full md:w-5/12 aspect-square" />
            <div className="flex-1 p-6 md:p-12 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <button
        onClick={() => router.push("/landing")}
        className="transition-all duration-150 flex bg-green text-black p-2 rounded-xl m-3 hover:bg-gray-950 hover:text-gray-600"
      >
        <ArrowBigLeftDash />
        Back To Home
      </button>
      <div className="pt-8 md:pt-16 pb-4 md:pb-8">
        <div className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-[#16db65] to-[#12b541] bg-clip-text text-transparent">
            Store
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Find the best products at the best prices
          </p>
        </div>

        <Suspense fallback={<SearchSkeleton />}>
          <SearchHeader />
        </Suspense>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr] gap-8 lg:gap-12">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Suspense fallback={<FilterSkeleton />}>
              <FilterProducts />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={<ProductsListSkeleton />}>
              <ProductsList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { setSearch, getAllProducts } from "@/store/Slice/productSlice";
import { Search, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchHeader() {
  const dispatch = useDispatch();
  const { search, loading } = useSelector((state) => state.products);
  const [searching, setSearching] = useState(search || "");

  const handleSearch = () => {
    const query = searching.trim();
    dispatch(setSearch(query));
    dispatch(getAllProducts({ search: query || undefined }));
  };

  const clearSearch = () => {
    setSearching("");
    dispatch(setSearch(""));
    dispatch(getAllProducts());
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mb-8 md:mb-12">
      <div className="relative max-w-4xl mx-auto">
        <Search
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none z-10"
          size={20}
        />

        <Input
          type="text"
          placeholder="Search products, brands, models..."
          value={searching}
          onChange={(e) => setSearching(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          disabled={loading}
          className="w-full h-14 md:h-16 pl-12 md:pl-16 pr-24 md:pr-32 rounded-2xl bg-white dark:bg-zinc-900 
            border-2 border-zinc-200 dark:border-zinc-800 text-base md:text-lg
            focus:border-[#16db65] focus:ring-4 focus:ring-[#16db65]/20 
            transition-all shadow-lg hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {searching && !loading && (
          <Button
            onClick={clearSearch}
            variant="ghost"
            size="icon"
            className="absolute right-20 md:right-28 top-1/2 -translate-y-1/2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <X size={20} className="text-zinc-500" />
          </Button>
        )}

        <Button
          onClick={handleSearch}
          disabled={loading}
          className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 
            bg-[#16db65] hover:bg-[#12b541] text-white font-bold 
            px-4 md:px-8 py-2 md:py-4 h-10 md:h-12 rounded-xl 
            shadow-lg hover:shadow-xl transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span className="hidden md:inline">Search</span>
              <Search size={20} className="md:hidden" />
            </>
          )}
        </Button>
      </div>

      {search && (
        <div className="text-center mt-4 text-sm md:text-base text-zinc-600 dark:text-zinc-400">
          Search results for:{" "}
          <span className="font-bold text-[#16db65]">{search}</span>
        </div>
      )}
    </div>
  );
}

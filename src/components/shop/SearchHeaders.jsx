// components/shop/SearchHeader.jsx

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "@/store/Slice/productSlice";
import { useProducts } from "@/hooks/product-hook/useProducts";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchHeader() {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => state.products);
  const { isLoading, isFetching } = useProducts();

  const loading = isLoading || isFetching;
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  const handleSearch = () => {
    dispatch(setSearch(query.trim()));
  };

  const handleClear = () => {
    setQuery("");
    dispatch(setSearch(""));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          disabled={loading}
          className="h-12 pl-11 pr-24 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 focus:border-[#16db65] focus:ring-2 focus:ring-[#16db65]/20"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
          >
            <X size={16} className="text-zinc-400" />
          </button>
        )}

        <Button
          onClick={handleSearch}
          disabled={loading}
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#16db65] hover:bg-[#12b541] h-8"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
        </Button>
      </div>

      {search && (
        <p className="text-center text-sm text-zinc-500 mt-3">
          Results for:{" "}
          <span className="font-medium text-[#16db65]">{search}</span>
        </p>
      )}
    </div>
  );
}

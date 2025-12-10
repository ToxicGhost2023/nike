// components/shop/FilterProducts.jsx

"use client";

import { useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter, resetFilters } from "@/store/Slice/productSlice";
import { useFilterOptions } from "@/hooks/product-hook/useFilterOptions";
import { Filter, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterProducts() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.products);

  // ✅ استفاده از React Query بجای Redux
  const { data: filterData, isLoading } = useFilterOptions();

  const [isOpen, setIsOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(filters.minPrice);
  const [priceMax, setPriceMax] = useState(filters.maxPrice);
  const priceTimer = useRef(null);

  // ✅ استخراج options از React Query data
  const options = useMemo(() => {
    // اگر دیتا هنوز نیومده، مقادیر خالی برگردون
    if (!filterData) {
      return { brands: [], categories: [], colors: [] };
    }

    // filterData از useFilterOptions میاد که select داره
    return {
      brands: filterData.brands || [],
      categories: filterData.categories || [],
      colors: filterData.colors || [],
    };
  }, [filterData]);

  const activeCount = useMemo(() => {
    return Object.values(filters).filter((v) => v && v !== "" && v !== false)
      .length;
  }, [filters]);

  // ✅ فقط Redux state رو آپدیت کن - React Query خودش refetch میکنه
  const applyFilter = (key, value) => {
    dispatch(setFilter({ key, value: value === "all" ? "" : value }));
  };

  // مدیریت قیمت با debounce
  const handlePriceChange = (type, value) => {
    if (type === "min") setPriceMin(value);
    else setPriceMax(value);

    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      dispatch(
        setFilter({ key: type === "min" ? "minPrice" : "maxPrice", value })
      );
    }, 500);
  };

  // ریست
  const handleReset = () => {
    setPriceMin("");
    setPriceMax("");
    dispatch(resetFilters());
  };

  return (
    <>
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full justify-between h-12 border-2"
        >
          <span className="flex items-center gap-2">
            <Filter size={18} />
            Filters
            {activeCount > 0 && (
              <Badge className="bg-[#16db65] text-white">{activeCount}</Badge>
            )}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <aside
        className={`
          bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800
          shadow-sm transition-all duration-200
          ${isOpen ? "block" : "hidden lg:block"}
        `}
      >
        <div className="p-5 space-y-6">
          {/* هدر */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Filter size={20} className="text-[#16db65]" />
              Filters
            </h3>
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-[#16db65]/10 text-[#16db65]"
              >
                {activeCount} active
              </Badge>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              {/* برند */}
              <FilterSelect
                label="Brand"
                value={filters.brand || "all"}
                options={options.brands}
                onChange={(v) => applyFilter("brand", v)}
              />

              {/* دسته‌بندی */}
              <FilterSelect
                label="Category"
                value={filters.category || "all"}
                options={options.categories}
                onChange={(v) => applyFilter("category", v)}
              />

              {/* محدوده قیمت */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Price Range ($)
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="flex-1 h-10 px-2 text-center rounded-lg border border-zinc-200 dark:border-zinc-700
                      bg-white dark:bg-zinc-800 text-sm
                      focus:outline-none focus:border-[#16db65] focus:ring-1 focus:ring-[#16db65]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="flex-1 h-10 px-2 text-center rounded-lg border border-zinc-200 dark:border-zinc-700
                      bg-white dark:bg-zinc-800 text-sm
                      focus:outline-none focus:border-[#16db65] focus:ring-1 focus:ring-[#16db65]"
                  />
                </div>
              </div>

              {/* رنگ‌ها */}
              {options.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {options.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          applyFilter(
                            "color",
                            filters.color === color ? "" : color
                          )
                        }
                        style={{ backgroundColor: color }}
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all
                          hover:scale-110
                          ${
                            filters.color === color
                              ? "border-[#16db65] ring-2 ring-[#16db65]/50 scale-110"
                              : "border-zinc-300 dark:border-zinc-600"
                          }
                        `}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* پرفروش */}
              <label className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer">
                <Checkbox
                  checked={filters.bestSeller || false}
                  onCheckedChange={(checked) =>
                    applyFilter("bestSeller", checked)
                  }
                  className="data-[state=checked]:bg-[#16db65] data-[state=checked]:border-[#16db65]"
                />
                <span className="text-sm font-medium">Best Sellers Only</span>
              </label>

              {/* ریست */}
              {activeCount > 0 && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Clear All
                </Button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-700">
          <SelectValue placeholder={`All ${label}s`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {label}s</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

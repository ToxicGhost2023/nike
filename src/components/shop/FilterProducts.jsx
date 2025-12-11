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
  const { data: filterData, isLoading } = useFilterOptions();

  const [isOpen, setIsOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(filters.minPrice);
  const [priceMax, setPriceMax] = useState(filters.maxPrice);
  const priceTimer = useRef(null);

  const options = useMemo(() => {
    if (!filterData) {
      return { brands: [], categories: [], colors: [] };
    }
    return {
      brands: filterData.brands || [],
      categories: filterData.categories || [],
      colors: filterData.colors || [],
    };
  }, [filterData]);

  const activeCount = useMemo(() => {
    return Object.values(filters).filter(
      (v) => v !== "" && v !== false && v !== null && v !== undefined
    ).length;
  }, [filters]);

  const applyFilter = (key, value) => {
    dispatch(setFilter({ key, value: value === "all" ? "" : value }));
  };

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

  const handleReset = () => {
    setPriceMin("");
    setPriceMax("");
    dispatch(resetFilters());
  };

  return (
    <>
      {/* دکمه باز/بستن برای موبایل */}
      <div className="lg:hidden mb-4 px-1">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="
            w-full justify-between h-11 rounded-xl
            border-zinc-200 dark:border-zinc-800
            bg-white/80 dark:bg-zinc-900/80
          "
        >
          <span className="flex items-center gap-2 text-sm">
            <Filter size={18} />
            Filters
            {activeCount > 0 && (
              <Badge className="ml-1 bg-emerald-500 text-white text-[11px] rounded-full px-2 py-0">
                {activeCount}
              </Badge>
            )}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {/* پنل فیلتر */}
      <aside
        className={`
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm
          rounded-2xl border border-zinc-200 dark:border-zinc-800
          transition-all duration-200
          ${isOpen ? "block" : "hidden lg:block"}
        `}
      >
        <div className="p-5 space-y-6">
          {/* هدر فیلتر */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Filter size={18} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide">Filters</h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Refine your product search
                </p>
              </div>
            </div>

            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] rounded-full px-3"
              >
                {activeCount} active
              </Badge>
            )}
          </div>

          {/* Skeleton لودینگ */}
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ) : (
            <>
              {/* فیلتر برند */}
              <FilterSelect
                label="Brand"
                value={filters.brand || "all"}
                options={options.brands}
                onChange={(v) => applyFilter("brand", v)}
              />

              {/* فیلتر دسته‌بندی */}
              <FilterSelect
                label="Category"
                value={filters.category || "all"}
                options={options.categories}
                onChange={(v) => applyFilter("category", v)}
              />

              {/* محدوده قیمت */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.15em]">
                  Price Range ($)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="
                      flex-1 h-10 rounded-lg border bg-white dark:bg-zinc-900
                      border-zinc-200 dark:border-zinc-700
                      text-xs text-center
                      focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                    "
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="
                      flex-1 h-10 rounded-lg border bg-white dark:bg-zinc-900
                      border-zinc-200 dark:border-zinc-700
                      text-xs text-center
                      focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                    "
                  />
                </div>
              </div>

              {/* فیلتر رنگ‌ها */}
              {options.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.15em]">
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
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all
                          hover:scale-110
                          ${
                            filters.color === color
                              ? "border-emerald-500 ring-2 ring-emerald-500/40 scale-110"
                              : "border-zinc-300 dark:border-zinc-600"
                          }
                        `}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* فقط پرفروش‌ها */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 cursor-pointer">
                <Checkbox
                  checked={filters.bestSeller || false}
                  onCheckedChange={(checked) =>
                    applyFilter("bestSeller", checked)
                  }
                  className="
                    data-[state=checked]:bg-emerald-500
                    data-[state=checked]:border-emerald-500
                  "
                />
                <span className="text-sm font-medium">Best sellers only</span>
              </label>

              {/* دکمه ریست */}
              {activeCount > 0 && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="
                    w-full h-10 rounded-xl text-sm
                    border-red-200 text-red-600
                    hover:bg-red-50 hover:text-red-700
                    dark:border-red-800/60 dark:text-red-400
                    dark:hover:bg-red-950/50
                  "
                >
                  <RefreshCw size={16} className="mr-2" />
                  Clear all filters
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
      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-[0.15em]">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm">
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

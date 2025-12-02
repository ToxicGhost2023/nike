"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, setFilters } from "@/store/Slice/productSlice";
import { Filter, X, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilterProducts() {
  const dispatch = useDispatch();
  const { products, filters, search } = useSelector((state) => state.products);

  const [selectedBrand, setSelectedBrand] = useState(filters.brand || "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.category || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    filters?.variants?.color || ""
  );
  const [showBestSeller, setShowBestSeller] = useState(
    filters.bestSeller || false
  );
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [openDropdown, setOpenDropdown] = useState(false);

  // محاسبه فیلترهای فعال
  const activeFiltersCount = [
    selectedBrand && selectedBrand !== "all",
    selectedCategory && selectedCategory !== "all",
    selectedColor,
    showBestSeller,
    priceRange.min,
    priceRange.max,
  ].filter(Boolean).length;

  // اعمال فیلترها
  useEffect(() => {
    const filters = {};

    // فقط فیلترهای معتبر رو اضافه کن
    if (selectedBrand && selectedBrand !== "all") {
      filters.brand = selectedBrand;
    }
    if (selectedCategory && selectedCategory !== "all") {
      filters.category = selectedCategory;
    }
    if (selectedColor) {
      filters.color = selectedColor;
    }
    if (showBestSeller) {
      filters.bestSeller = true;
    }
    if (priceRange.min && !isNaN(parseFloat(priceRange.min))) {
      filters.minPrice = parseFloat(priceRange.min);
    }
    if (priceRange.max && !isNaN(parseFloat(priceRange.max))) {
      filters.maxPrice = parseFloat(priceRange.max);
    }

    dispatch(
      getAllProducts({
        filters,
        search: search || undefined,
      })
    );
  }, [
    selectedBrand,
    selectedCategory,
    selectedColor,
    showBestSeller,
    priceRange,
    search,
    dispatch,
  ]);

  // استخراج داده‌ها
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const colors = [
    ...new Set(
      products.flatMap((p) => p.variants?.map((v) => v.colorCode) || [])
    ),
  ].filter(Boolean);

  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setSelectedColor("");
    setShowBestSeller(false);
    setPriceRange({ min: "", max: "" });
    dispatch(getAllProducts({ search }));
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6 px-4">
        <Button
          onClick={() => setOpenDropdown(!openDropdown)}
          variant="outline"
          className="w-full h-14 text-base font-bold border-2 border-zinc-200 dark:border-zinc-800 
            hover:border-[#16db65] hover:bg-[#16db65]/5 transition-all relative"
        >
          <Filter size={20} className="mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-[#16db65] text-white px-2 py-1">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown
            size={20}
            className="ml-auto transition-transform"
            style={{
              transform: openDropdown ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Button>
      </div>

      {/* Filter Panel */}
      <aside
        className={`
          bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border-2 border-zinc-200 dark:border-zinc-800
          transition-all duration-300 overflow-hidden
          ${openDropdown ? "block" : "hidden lg:block"}
        `}
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Filter size={24} className="text-[#16db65]" />
              <h3 className="text-2xl font-black">Filters</h3>
            </div>
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-[#16db65]/10 text-[#16db65] font-bold"
              >
                {activeFiltersCount} Active
              </Badge>
            )}
          </div>

          <div className="space-y-8">
            {/* Brand */}
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Brand
              </label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger
                  className="w-full h-12 border-2 border-zinc-200 dark:border-zinc-800 
                  hover:border-[#16db65] focus:border-[#16db65] transition-all rounded-xl"
                >
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  className="w-full h-12 border-2 border-zinc-200 dark:border-zinc-800 
                  hover:border-[#16db65] focus:border-[#16db65] transition-all rounded-xl"
                >
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Price Range ($)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="h-12 px-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl
                    focus:outline-none focus:border-[#16db65] focus:ring-2 focus:ring-[#16db65]/20
                    bg-white dark:bg-zinc-950 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="h-12 px-4 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl
                    focus:outline-none focus:border-[#16db65] focus:ring-2 focus:ring-[#16db65]/20
                    bg-white dark:bg-zinc-950 transition-all"
                />
              </div>
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        setSelectedColor(selectedColor === c ? "" : c)
                      }
                      style={{ backgroundColor: c }}
                      className={`
                        w-12 h-12 rounded-xl shadow-md hover:shadow-lg transition-all
                        border-4 transform hover:scale-110
                        ${
                          selectedColor === c
                            ? "border-[#16db65] ring-4 ring-[#16db65]/30 scale-110"
                            : "border-white dark:border-zinc-800"
                        }
                      `}
                      title={c}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <div className="text-xs text-zinc-500 mt-2">
                    Selected: <span className="font-bold">{selectedColor}</span>
                  </div>
                )}
              </div>
            )}

            {/* Best Seller */}
            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border-2 border-zinc-200 dark:border-zinc-800">
              <Checkbox
                id="bestSeller"
                checked={showBestSeller}
                onCheckedChange={setShowBestSeller}
                className="w-6 h-6 border-2 data-[state=checked]:bg-[#16db65] data-[state=checked]:border-[#16db65]"
              />
              <label
                htmlFor="bestSeller"
                className="text-sm font-bold cursor-pointer select-none flex-1"
              >
                Best Sellers Only
              </label>
            </div>

            {/* Reset Button */}
            {activeFiltersCount > 0 && (
              <Button
                onClick={resetFilters}
                variant="destructive"
                className="w-full h-12 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <RefreshCw size={18} className="mr-2" />
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

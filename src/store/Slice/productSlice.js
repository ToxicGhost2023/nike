import { createSlice } from "@reduxjs/toolkit";

const initialFilters = {
  brand: "",
  category: "",
  color: "",
  bestSeller: false,
  minPrice: "",
  maxPrice: "",
};

const productSlice = createSlice({
  name: "products",
  initialState: {
    search: "",
    filters: initialFilters,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    resetAll: (state) => {
      state.search = "";
      state.filters = initialFilters;
    },
  },
});

export const { setSearch, setFilter, setFilters, resetFilters, resetAll } =
  productSlice.actions;

export default productSlice.reducer;

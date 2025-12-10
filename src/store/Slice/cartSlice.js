import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  filters: {
    brand: "",
    category: "",
    color: "",
    bestSeller: false,
    minPrice: "",
    maxPrice: "",
  },
  pagination: {
    page: 1,
    limit: 12,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.pagination.page = 1; // با تغییر سرچ برگرد به صفحه اول
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        brand: "",
        category: "",
        color: "",
        bestSeller: false,
        minPrice: "",
        maxPrice: "",
      };
      state.pagination.page = 1;
    },
    resetAll: (state) => {
      state.search = "";
      state.filters = {
        brand: "",
        category: "",
        color: "",
        bestSeller: false,
        minPrice: "",
        maxPrice: "",
      };
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
  },
});

export const {
  setSearch,
  setFilter,
  resetFilters,
  resetAll,
  setPage,
  setLimit,
} = productSlice.actions;

export default productSlice.reducer;

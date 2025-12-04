// store/Slice/productSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// گرفتن محصولات
export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { search, filters } = getState().products;

      const params = new URLSearchParams();
      params.set("limit", "100");

      // سرچ
      if (search) params.set("search", search);

      // فیلترها
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "" && value !== false) {
          params.set(key, String(value));
        }
      });

      const res = await axios.get(`/api/products?${params}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "خطا در دریافت محصولات"
      );
    }
  }
);

// گرفتن همه محصولات بدون فیلتر (برای dropdown ها)
export const fetchFilterOptions = createAsyncThunk(
  "products/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/products?limit=1000");
      return res.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "خطا");
    }
  }
);

// سایر thunk ها...
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/products", formData);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to create");
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/products/${productId}`);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/products/${productId}`, formData);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    filterOptions: [], // برای dropdown ها
    currentProduct: null,
    loading: false,
    error: null,
    search: "",
    filters: {
      brand: "",
      category: "",
      color: "",
      bestSeller: false,
      minPrice: "",
      maxPrice: "",
    },
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
    // loading states
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    successCreate: false,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
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
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.successCreate = false;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Filter Options
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload || [];
      })

      // Get By ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.loadingCreate = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loadingCreate = false;
        state.successCreate = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loadingCreate = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        const idx = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  setFilter,
  resetFilters,
  resetAll,
  clearErrors,
  clearCreateSuccess,
  clearCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer;

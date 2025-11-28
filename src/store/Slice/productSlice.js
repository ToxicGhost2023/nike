// store/Slice/productSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// --- ایجاد محصول ---
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/products", formData);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create product"
      );
    }
  }
);

// --- گرفتن همه محصولات ---
export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async ({ page = 1, limit = 12, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit, ...filters });
      const res = await axios.get(`/api/products?${params}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch products"
      );
    }
  }
);

// --- حذف محصول ---
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete product"
      );
    }
  }
);

// --- ویرایش محصول ---
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/products/${productId}`, formData);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    successCreate: false,
    error: null,
    errorCreate: null,
    errorUpdate: null,
    errorDelete: null,
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.errorCreate = null;
      state.errorUpdate = null;
      state.errorDelete = null;
    },
    clearCreateSuccess: (state) => {
      state.successCreate = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
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
        state.errorCreate = action.payload;
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
        state.errorDelete = action.payload;
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate = action.payload;
      });
  },
});

export const { clearErrors, clearCreateSuccess } = productSlice.actions;
export default productSlice.reducer;

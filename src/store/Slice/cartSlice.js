// store/Slice/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    isCartOpen: false,
    isCheckoutLoading: false,
  },
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCheckoutLoading: (state, action) => {
      state.isCheckoutLoading = action.payload;
    },
  },
});

export const { openCart, closeCart, toggleCart, setCheckoutLoading } =
  cartSlice.actions;

export default cartSlice.reducer;

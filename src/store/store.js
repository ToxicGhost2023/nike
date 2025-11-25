import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "@/store/Slice/usersSlice";
import productsReducer from "@/store/Slice/productSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
  },
});

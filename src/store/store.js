import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "@/store/Slice/usersSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

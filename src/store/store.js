// store/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import usersReducer from "@/store/Slice/usersSlice";
import productsReducer from "@/store/Slice/productSlice";
import cartReducer from "@/store/Slice/cartSlice";

const persistConfig = {
  key: "root",
  storage: typeof window !== "undefined" ? storage : undefined,
  whitelist: ["cart"], // فقط cart persist شود - products نیازی نداره چون فقط UI state داره
};

const rootReducer = combineReducers({
  users: usersReducer,
  products: productsReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export let persistor;
if (typeof window !== "undefined") {
  persistor = persistStore(store);
} else {
  persistor = undefined;
}

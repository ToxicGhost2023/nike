// store/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";

import usersReducer from "@/store/Slice/usersSlice";
import productsReducer from "@/store/Slice/productSlice";
import cartReducer from "@/store/Slice/cartSlice";

// اول همیشه rootReducer را بدون persist بساز
const rootReducer = combineReducers({
  users: usersReducer,
  products: productsReducer,
  cart: cartReducer,
});

// اگر در کلاینت هستیم persist را فعال می‌کنیم
let persistedReducer = rootReducer;
let persistor = null;

// این block فقط در مرورگر اجرا می‌شود
if (typeof window !== "undefined") {
  const storage = require("redux-persist/lib/storage").default;
  const {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } = require("redux-persist");

  const persistConfig = {
    key: "root",
    storage,
    whitelist: ["cart"], // فقط cart ذخیره شود
  };

  persistedReducer = persistReducer(persistConfig, rootReducer);

  // ساخت persistor فقط در مرورگر
  persistor = persistStore(
    configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    })
  );
}

// Store اصلی (هم برای SSR هم برای کلاینت)
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
});

// Export persistor فقط در کلاینت معتبر است
export { persistor };

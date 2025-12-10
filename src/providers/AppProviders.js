"use client";

import QueryProvider from "./QueryProvider";
import { ReduxProvider } from "./ReduxProviders";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}

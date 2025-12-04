// src/providers/LoaderProvider.js
"use client";

import NextTopLoader from "nextjs-toploader";

const LoaderProvider = ({ children }) => {
  return (
    <>
      <NextTopLoader
        color="#fffd00"
        initialPosition={0.08}
        crawlSpeed={200}
        height={4}
        crawl={true}
        showSpinner={false} // اگر اسپینر دایره‌ای گوشه صفحه را می‌خواهی true کن
        easing="ease"
        speed={200}
        shadow="0 0 10px #fffd00,0 0 5px #fffd00"
        zIndex={99999} // این خط باعث میشه لودر روی همه چیز بیاد
      />
      {children}
    </>
  );
};

export default LoaderProvider;

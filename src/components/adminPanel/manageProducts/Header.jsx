"use client";

import { Spinner } from "@/components/ui/spinner";
import { useState, lazy, Suspense } from "react";

const ProductsList = lazy(() => import("./ProductsList"));
const AddProducts = lazy(() => import("./AddProducts"));
const EditProducts = lazy(() => import("./EditProducts"));

export default function Header() {
  const [view, setView] = useState("ProductsList");

  const renderView = () => {
    switch (view) {
      case "ProductsList":
        return <ProductsList />;
      case "AddProducts":
        return <AddProducts />;
      case "EditProducts":
        return <EditProducts />;
      default:
        return <div>nothing found</div>;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-12 border-b pb-3 mb-4">
        <button
          className="px-4 py-2 rounded-md border border-green  shadow-md 
                 hover:shadow-[0_0_20px_#70e000] transition-shadow duration-300"
          onClick={() => setView("ProductsList")}
        >
          ProductsList
        </button>
        <button
          className="px-4 py-2 rounded-md border border-green  shadow-md 
                 hover:shadow-[0_0_20px_#70e000] transition-shadow duration-300"
          onClick={() => setView("AddProducts")}
        >
          AddProducts
        </button>
        <button
          className="px-4 py-2 rounded-md border border-green  shadow-md 
                 hover:shadow-[0_0_20px_#70e000] transition-shadow duration-300"
          onClick={() => setView("EditProducts")}
        >
          EditProducts
        </button>
      </div>

      <Suspense fallback={<Spinner />}>{renderView()}</Suspense>
    </div>
  );
}

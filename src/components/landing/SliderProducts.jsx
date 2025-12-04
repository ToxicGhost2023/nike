"use client";
import { getAllProducts } from "@/store/Slice/productSlice";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../ui/spinner";

function SliderProducts() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, speed: 8 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  console.log(products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelectedIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => embla.off("select", onSelect);
  }, [embla]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">
          <Spinner />
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {products?.map((slide, idx) => (
          <div
            key={idx}
            className="flex-[0_0_95%] relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px]"
          >
            <Image
              src={slide.mainImage}
              fill
              priority
              alt={slide.alt || `Slide ${idx + 1}`}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity" />
            {slide && (
              <div className="absolute bottom-20 left-10 sm:bottom-24 sm:left-16 text-orange-600">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
                  {slide?.brand}
                </h2>
                <p className="mt-2 text-lg sm:text-xl md:text-2xl text-black font-extrabold">
                  {slide?.model}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {embla && (
        <>
          <button
            onClick={() => embla.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-green rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
          >
            <ArrowBigLeft />
          </button>
          <button
            onClick={() => embla.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-green rounded-full flex items-center justify-center shadow-lg hover:bg-white transition"
          >
            <ArrowBigRight />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {embla && (
        <div className="absolute bottom-8 w-full flex justify-center gap-3">
          {products.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === selectedIndex ? "bg-green" : "bg-white/50"
              }`}
              onClick={() => embla.scrollTo(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SliderProducts;

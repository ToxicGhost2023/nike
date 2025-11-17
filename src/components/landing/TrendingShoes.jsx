"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function TrendingShoes() {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingShoes();
  }, []);

  const fetchTrendingShoes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trending-shoes");
      const data = await res.json();

      if (data.success) {
        setShoes(data.shoes);
      } else {
        setError("Failed to load shoes");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error}</p>
        <Button
          onClick={fetchTrendingShoes}
          className="mt-4 bg-gradient-to-r from-[#70e000] to-[#16db65] text-black"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#70e000]/30 bg-[#70e000]/5">
            <TrendingUp className="w-4 h-4 text-[#70e000]" />
            <span className="text-sm font-medium text-[#70e000]">
              Most Popular
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Trending{" "}
            <span className="bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
              Sneakers
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Discover the hottest sneakers everyone is talking about
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="trending-swiper !pb-14"
        >
          {shoes.map((shoe, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <ShoeCard shoe={shoe} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

// Shoe Card Component
function ShoeCard({ shoe, index }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group h-full border-border hover:border-[#70e000] transition-all duration-300 hover:shadow-lg hover:shadow-[#70e000]/10 overflow-hidden">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
          {!imageError && shoe.thumbnail ? (
            <Image
              src={shoe.thumbnail}
              alt={shoe.shoeName || "Sneaker"}
              fill
              priority
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Sparkles className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Overlay Badge */}
          {index < 3 && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-[#70e000] to-[#16db65] text-black text-xs font-bold">
              #{index + 1} Trending
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Brand */}
          <p className="text-xs font-semibold text-[#16db65] uppercase tracking-wider">
            {shoe.brand || "Nike"}
          </p>

          {/* Name */}
          <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 min-h-[3rem] group-hover:text-[#70e000] transition-colors">
            {shoe.shoeName || "Sneaker"}
          </h3>

          {/* Price & Release Date */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Retail Price</p>
              <p className="text-lg font-bold text-foreground">
                {shoe.retailPrice ? `$${shoe.retailPrice}` : "N/A"}
              </p>
            </div>
            {shoe.releaseDate && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Released</p>
                <p className="text-sm font-medium text-foreground">
                  {shoe.releaseDate}
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            asChild
            className="w-full group/btn bg-gradient-to-r from-[#70e000] to-[#16db65] text-black font-medium hover:opacity-90 transition-opacity"
          >
            <a
              href={shoe.goatProductUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              View Details
              <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <section className="w-full py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

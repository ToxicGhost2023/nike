"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/store/Slice/productSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function ProductsList() {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector(
    (state) => state.products || {}
  );

  useEffect(() => {
    dispatch(getAllProducts({ page: 1, limit: 12 }));
  }, [dispatch]);

  // لودینگ اسکلتون زیبا
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full rounded-t-lg" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // خطا
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>Failed to load products: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // وقتی محصول نیست
  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">No products found</div>
        <p className="text-xl text-muted-foreground">
          Be the first to add a product!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* تعداد محصولات */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground mt-2">
          {pagination.total} products available
        </p>
      </div>

      {/* لیست محصولات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const variant = product.variants[0];
          const price = variant?.finalPrice || variant?.price || 0;
          const hasDiscount = variant?.discount > 0;

          return (
            <Card
              key={product._id}
              className="group overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.mainImage || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {hasDiscount && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      -{variant.discount}%
                    </Badge>
                  )}
                  {product.bestSeller && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                      Best Seller
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {product.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.model}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-bold text-primary">
                        ${price}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        ${variant.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      ${price}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex items-center justify-between w-full text-sm">
                  <span className="text-muted-foreground">
                    Stock: {variant.stock}
                  </span>
                  <div className="flex gap-1">
                    {product.availableColors?.slice(0, 3).map((color) => (
                      <div
                        key={color}
                        className="w-5 h-5 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.availableColors?.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{product.availableColors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* صفحه‌بندی ساده */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() =>
                dispatch(getAllProducts({ page: i + 1, limit: 12 }))
              }
              className={`px-4 py-2 rounded-lg transition ${
                pagination.page === i + 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsList;

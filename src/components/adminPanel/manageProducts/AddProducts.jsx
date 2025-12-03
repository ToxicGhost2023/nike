"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/store/Slice/productSlice";
import { useRouter } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // کامپوننت آلرت

// Icons
import {
  Loader2,
  Plus,
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AddProductForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux State
  const { loading: reduxLoading } = useSelector((state) => state.products);

  const [uploading, setUploading] = useState(false); // برای مدیریت آپلود عکس‌ها
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",
      model: "",
      brand: "Nike",
      category: "sneakers",
      description: "",
      variants: [
        {
          color: "",
          colorCode: "#000000",
          size: "",
          price: "",
          discount: 0,
          stock: "",
          images: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const watchedVariants = watch("variants");
  const isLoading = reduxLoading || uploading;

  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentImages = watchedVariants[index]?.images || [];
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setValue(`variants.${index}.images`, [...currentImages, ...newImages]);
  };

  // حذف عکس
  const removeImage = (variantIndex, imgIndex) => {
    const updatedImages = watchedVariants[variantIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setValue(`variants.${variantIndex}.images`, updatedImages);
  };

  // ارسال فرم
  const onSubmit = async (data) => {
    setUploading(true);
    setNotification(null); // پاک کردن پیام‌های قبلی

    try {
      const formData = new FormData();

      // فیلدهای اصلی
      formData.append("title", data.title);
      formData.append("model", data.model);
      formData.append("brand", data.brand);
      formData.append("category", data.category);
      formData.append("description", data.description);

      // فیلدهای واریانت
      data.variants.forEach((v, i) => {
        formData.append(`variants[${i}][color]`, v.color);
        formData.append(`variants[${i}][colorCode]`, v.colorCode);
        formData.append(`variants[${i}][size]`, v.size);
        formData.append(`variants[${i}][price]`, v.price);
        formData.append(`variants[${i}][discount]`, v.discount || 0);
        formData.append(`variants[${i}][stock]`, v.stock);

        // عکس‌ها
        v.images.forEach((img) => {
          formData.append(`variants[${i}][images]`, img.file);
        });
      });

      const result = await dispatch(createProduct(formData));

      if (createProduct.fulfilled.match(result)) {
        // موفقیت
        setNotification({
          type: "success",
          message: "Product created successfully! You can add another one.",
        });
        reset(); // خالی کردن فرم
        window.scrollTo({ top: 0, behavior: "smooth" }); // اسکرول به بالا برای دیدن پیام
      } else {
        // خطای سرور (که ریداکس هندل کرده)
        throw new Error(result.payload || "Failed to create product");
      }
    } catch (error) {
      // خطا
      setNotification({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold ">Add New Product</h1>
          <p className="text-zinc-500">Create a new product with variants</p>
        </div>

        {/* نمایش نوتیفیکیشن (Alert) */}
        {notification && (
          <Alert
            variant={notification.type === "error" ? "destructive" : "default"}
            className={`animate-in fade-in slide-in-from-top-5 duration-300 ${
              notification.type === "success"
                ? "border-green-500 bg-green-50 text-green-700 [&>svg]:text-green-600"
                : ""
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle className="ml-2 font-bold">
              {notification.type === "success" ? "Success!" : "Error!"}
            </AlertTitle>
            <AlertDescription className="ml-2">
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* اطلاعات کلی */}
          <Card>
            <CardHeader>
              <CardTitle>General Info</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Title</Label>
                <Input
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. Air Jordan"
                />
              </div>
              <div>
                <Label>Model Code</Label>
                <Input
                  {...register("model", { required: true })}
                  placeholder="e.g. AJ1-High"
                />
              </div>
              <div>
                <Label>Brand</Label>
                <Input {...register("brand")} placeholder="Nike" />
              </div>
              <div>
                <Label>Category</Label>
                <Input {...register("category")} placeholder="Sneakers" />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Product details..."
                />
              </div>
            </CardContent>
          </Card>

          {/* واریانت‌ها */}
          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="border-l-4 0 relative shadow-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <X className="w-5 h-5" />
                </Button>

                <CardHeader>
                  <CardTitle>Variant #{index + 1}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Color Name</Label>
                      <Input
                        {...register(`variants.${index}.color`, {
                          required: true,
                        })}
                        placeholder="Red"
                      />
                    </div>
                    <div>
                      <Label>Color Hex</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          {...register(`variants.${index}.colorCode`)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          {...register(`variants.${index}.colorCode`)}
                          placeholder="#FF0000"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Size</Label>
                      <Input
                        {...register(`variants.${index}.size`, {
                          required: true,
                        })}
                        placeholder="42"
                      />
                    </div>
                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        {...register(`variants.${index}.stock`, {
                          required: true,
                        })}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        {...register(`variants.${index}.price`, {
                          required: true,
                        })}
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <Label>Discount (%)</Label>
                      <Input
                        type="number"
                        {...register(`variants.${index}.discount`)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* آپلود عکس */}
                  <div className="border-2 border-dashed border-zinc-200  transition-colors rounded-xl p-6  text-center">
                    <input
                      id={`file-${index}`}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    <Label
                      htmlFor={`file-${index}`}
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <UploadCloud className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-blue-600 hover:underline">
                          Click to upload
                        </span>
                        <span className="text-zinc-500 text-sm">
                          {" "}
                          or drag and drop
                        </span>
                      </div>
                    </Label>

                    {watchedVariants[index]?.images?.length > 0 && (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-6 pt-4 border-t">
                        {watchedVariants[index].images.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative group aspect-square rounded-lg overflow-hidden border bg-white shadow-sm"
                          >
                            <img
                              src={img.preview}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, imgIdx)}
                              className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 h-14 text-lg border-dashed border-2 hover:border-blue-500 hover:text-blue-600"
              onClick={() =>
                append({
                  color: "",
                  colorCode: "#000000",
                  size: "",
                  price: "",
                  stock: "",
                  images: [],
                })
              }
            >
              <Plus className="mr-2" /> Add Another Variant
            </Button>

            <Button
              type="submit"
              size="lg"
              className="flex-1 h-14 text-lg font-bold shadow-lg shadow-blue-900/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {uploading ? "Uploading Images..." : "Creating Product..."}
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

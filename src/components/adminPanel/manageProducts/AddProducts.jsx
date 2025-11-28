"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/store/Slice/productSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, X } from "lucide-react";

export default function AddProductForm() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.products);

  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      model: "",
      brand: "Nike",
      category: "sneakers",
      description: "",
      variants: [
        {
          color: "",
          colorCode: "",
          size: "",
          price: "",
          discount: 0,
          stock: "",
          sku: "",
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

  const handleImageChange = (e, index) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    const current = watchedVariants[index]?.images || [];
    setValue(`variants.${index}.images`, [...current, ...newImages]);
  };

  const removeImage = (variantIndex, imgIndex) => {
    const updated = watchedVariants[variantIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setValue(`variants.${variantIndex}.images`, updated);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("model", data.model);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("description", data.description);

    data.variants.forEach((v, i) => {
      formData.append(`variants[${i}][color]`, v.color);
      formData.append(`variants[${i}][colorCode]`, v.colorCode || "");
      formData.append(`variants[${i}][size]`, v.size);
      formData.append(`variants[${i}][price]`, v.price);
      formData.append(`variants[${i}][discount]`, v.discount || 0);
      formData.append(`variants[${i}][stock]`, v.stock);
      formData.append(`variants[${i}][sku]`, v.sku || "");
      v.images.forEach(
        (img) => img.file && formData.append(`variants[${i}][images]`, img.file)
      );
    });

    dispatch(createProduct(formData));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <Card className="border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Product Title</Label>
                  <Input
                    {...register("title", { required: true })}
                    placeholder="e.g. Air Jordan 1 Retro"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Model Code</Label>
                  <Input
                    {...register("model", { required: true })}
                    placeholder="e.g. AJ1-RETRO-001"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Write a detailed description..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="border-2 border-primary/20 shadow-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Variant {index + 1}</CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
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
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Color Code (Hex)</Label>
                    <Input
                      {...register(`variants.${index}.colorCode`)}
                      placeholder="#ff0000"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Size (EU)</Label>
                    <select
                      {...register(`variants.${index}.size`, {
                        required: true,
                      })}
                      className="w-full px-4 py-3  border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      defaultValue=""
                    >
                      <option className="bg-black" value="" disabled>
                        Select size
                      </option>
                      {[
                        "36",
                        "37",
                        "38",
                        "39",
                        "40",
                        "41",
                        "42",
                        "43",
                        "44",
                        "45",
                        "46",
                        "47",
                        "48",
                      ].map((s) => (
                        <option className="bg-black" key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.price`, {
                        required: true,
                      })}
                      placeholder="299"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Discount (%)</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.discount`)}
                      placeholder="0"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock`, {
                        required: true,
                      })}
                      placeholder="50"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>SKU (Optional)</Label>
                    <Input
                      {...register(`variants.${index}.sku`)}
                      placeholder="AJ1-RED-42"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>Product Images</Label>
                  <div
                    className="mt-3 border-2 border-dashed border-primary/30 rounded-xl p-12 text-center cursor-pointer hover:border-primary/60 transition-all"
                    onClick={() =>
                      document.getElementById(`images-${index}`)?.click()
                    }
                  >
                    <div className="text-5xl text-primary/50 mb-4">Upload</div>
                    <p className="text-lg font-medium">
                      Click or drag images here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports multiple images
                    </p>
                    <input
                      id={`images-${index}`}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>

                  {watchedVariants[index]?.images?.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
                      {watchedVariants[index].images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img.url}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-primary/20 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, i)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() =>
              append({
                color: "",
                colorCode: "",
                size: "",
                price: "",
                discount: 0,
                stock: "",
                sku: "",
                images: [],
              })
            }
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Variant
          </Button>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full text-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </form>

        {success && (
          <Alert className="mt-8 border-green-500 bg-green-500/10">
            <AlertDescription className="text-green-600 font-medium">
              Product created successfully!
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mt-8">
            <AlertDescription>Error: {error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

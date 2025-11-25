"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/store/Slice/productSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

export default function AddProducts() {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.products);

  const [variants, setVariants] = useState([
    {
      color: "",
      colorCode: "",
      size: "",
      price: "",
      discount: 0,
      stock: "",
      sku: "",
      images: [], // آرایه خالی برای آپلود عکس
    },
  ]);

  const [productData, setProductData] = useState({
    title: "",
    model: "",
    brand: "Nike",
    category: "casual",
    gender: "men",
    description: "",
  });

  // آپلود عکس با drag & drop یا کلیک
  const handleImageUpload = (e, variantIndex) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const newVariants = [...variants];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newVariants[variantIndex].images.push({
          url: reader.result,
          file: file,
        });
        setVariants([...newVariants]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (variantIndex, imgIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images.splice(imgIndex, 1);
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
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
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...productData,
      variants: variants.map((v) => ({
        ...v,
        price: Number(v.price),
        discount: Number(v.discount || 0),
        stock: Number(v.stock),
        images: v.images.map((img) => ({ url: img.url })),
      })),
    };

    dispatch(createProduct(finalData));
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Add New Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* اطلاعات اصلی محصول */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Nike Air Max 270"
                    value={productData.title}
                    onChange={(e) =>
                      setProductData({ ...productData, title: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model Name</Label>
                  <Input
                    id="model"
                    placeholder="e.g. Air Max 270"
                    value={productData.model}
                    onChange={(e) =>
                      setProductData({ ...productData, model: e.target.value })
                    }
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Write product description..."
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value,
                    })
                  }
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* واریانت‌ها */}
              {variants.map((variant, vIndex) => (
                <Card key={vIndex} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex justify-between items-center">
                      Variant {vIndex + 1}
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setVariants(variants.filter((_, i) => i !== vIndex))
                          }
                          className="text-red-500 hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Color</Label>
                        <Input
                          placeholder="Black/White"
                          value={variant.color}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[vIndex].color = e.target.value;
                            setVariants(newV);
                          }}
                          className="bg-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label>Color Code</Label>
                        <Input
                          placeholder="#000000"
                          value={variant.colorCode}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[vIndex].colorCode = e.target.value;
                            setVariants(newV);
                          }}
                          className="bg-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label>Size</Label>
                        <Input
                          placeholder="42"
                          value={variant.size}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[vIndex].size = e.target.value;
                            setVariants(newV);
                          }}
                          className="bg-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label>Price (Toman)</Label>
                        <Input
                          type="number"
                          placeholder="5800000"
                          value={variant.price}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[vIndex].price = e.target.value;
                            setVariants(newV);
                          }}
                          className="bg-gray-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Discount (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={variant.discount}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[vIndex].discount = e.target.value;
                            setVariants(newV);
                          }}
                          className="bg-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          placeholder="10"
                          value={variant.stock}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[vIndex].stock = e.target.value;
                            setVariants(newV);
                          }}
                          className="bg-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label>SKU</Label>
                        <Input
                          placeholder="NK-AM270-BLK-42"
                          value={variant.sku}
                          onChange={(e) => {
                            const newV = [...variants];
                            newV[vIndex].sku = e.target.value;
                            setVariants(newV);
                          }}
                          className="bg-gray-700 text-white"
                        />
                      </div>
                    </div>

                    {/* آپلود عکس */}
                    <div>
                      <Label>Product Images (Click or Drag)</Label>
                      <div
                        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition"
                        onDrop={(e) => {
                          e.preventDefault();
                          handleImageUpload(e, vIndex);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() =>
                          document.getElementById(`file-${vIndex}`).click()
                        }
                      >
                        <Upload className="mx-auto h-12 w-12 text-gray-500" />
                        <p className="text-sm text-gray-400 mt-2">
                          Drop images here or click to upload
                        </p>
                        <input
                          id={`file-${vIndex}`}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, vIndex)}
                        />
                      </div>

                      {/* نمایش عکس‌های آپلود شده */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                        {variant.images.map((img, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={img.url}
                              alt={`Upload ${i + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(vIndex, i)}
                              className="absolute top-1 right-1 bg-red-600 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                onClick={addVariant}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Another Variant
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </form>

            {/* وضعیت */}
            {success && (
              <Alert className="mt-6 bg-green-900 border-green-700">
                <AlertDescription className="text-white">
                  Product created successfully!
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mt-6 bg-red-900 border-red-700">
                <AlertDescription className="text-white">
                  Error: {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

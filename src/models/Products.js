// models/Product.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const variantSchema = new Schema({
  color: { type: String, required: true },
  colorCode: { type: String },
  size: {
    type: String,
    required: true,
    enum: [
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
    ],
  },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  finalPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  images: [{ type: String }],
});

variantSchema.pre("save", async function () {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
});

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    model: { type: String, required: true },
    brand: { type: String, default: "Nike" },
    category: { type: String, required: true },
    description: { type: String, required: true },
    variants: [variantSchema],
    mainImages: [{ type: String }],
    availableColors: [{ type: String }],
    availableSizes: [{ type: String }],
    likedBy: [{ type: String }],
    likes: { type: Number, default: 0 },
    bestSeller: { type: Boolean, default: false },
    totalStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre("save", async function () {
  this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  this.availableColors = [...new Set(this.variants.map((v) => v.color))];
  this.availableSizes = [...new Set(this.variants.map((v) => v.size))].sort();
  const allImages = this.variants.flatMap((v) => v.images || []);
  if (allImages.length > 0) {
    this.mainImages = allImages;
  }
});

export default models.Product || model("Product", productSchema);

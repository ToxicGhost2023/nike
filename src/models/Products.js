import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const variantSchema = new Schema({
  color: { type: String, required: true },
  colorCode: { type: String },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  finalPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, sparse: true },
  images: [{ type: String }],
});
variantSchema.pre("save", function () {
  if (this.price) {
    this.finalPrice = this.price - (this.price * (this.discount || 0)) / 100;
  }
});

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    model: { type: String, required: true },
    brand: { type: String, default: "Nike" },
    category: { type: String, required: true },
    description: { type: String, required: true },
    variants: [variantSchema],
    mainImage: { type: String },
    availableColors: [{ type: String }],
    availableSizes: [{ type: String }],
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
  if (
    !this.mainImage &&
    this.variants.length > 0 &&
    this.variants[0].images.length > 0
  ) {
    this.mainImage = this.variants[0].images[0];
  }
});

export default models.Product || model("Product", productSchema);

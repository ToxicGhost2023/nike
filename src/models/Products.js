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
  finalPrice: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  sku: { type: String, unique: true },
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String },
    },
  ],
});

variantSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "نام کفش الزامی است"],
      trim: true,
      index: true,
    },
    model: { type: String, required: true },
    brand: {
      type: String,
      default: "Nike",
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["مردانه", "زنانه", "بچه‌گانه"],
      required: true,
    },
    description: { type: String, required: true },

    // همه رنگ‌ها و سایزها اینجا هستن
    variants: [variantSchema],

    // برای نمایش سریع در گالری
    mainImage: { type: String }, // عکس اصلی (اولین عکس اولین واریانت)
    availableColors: [{ type: String }], // مثل: ["مشکی", "سفید", "قرمز"]
    availableSizes: [{ type: String }], // مثل: ["40", "41", "42", "43"]

    // سیستم لایک و پرفروش
    likedBy: [{ type: String }],
    likes: { type: Number, default: 0 },
    bestSeller: { type: Boolean, default: false, index: true },
    totalStock: { type: Number, default: 0 }, // جمع موجودی همه سایزها
  },
  { timestamps: true }
);

// قبل از ذخیره: آپدیت خودکار فیلدهای کمکی
productSchema.pre("save", function (next) {
  // جمع موجودی همه سایزها
  this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);

  // لیست رنگ‌ها و سایزهای موجود (برای نمایش در گالری)
  this.availableColors = [...new Set(this.variants.map((v) => v.color))];
  this.availableSizes = [...new Set(this.variants.map((v) => v.size))].sort();

  // عکس اصلی محصول
  if (this.variants.length > 0 && this.variants[0].images.length > 0) {
    this.mainImage = this.variants[0].images[0].url;
  }

  next();
});

// ایندکس‌های مهم برای سرعت
productSchema.index({ title: "text", model: "text" });
productSchema.index({ brand: 1, createdAt: -1 });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ bestSeller: -1 });

export default models.Product || model("Product", productSchema);

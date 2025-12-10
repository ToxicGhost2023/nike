import { Schema, model, models } from "mongoose";

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  variantId: { type: Schema.Types.ObjectId, required: true, index: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  priceAtAdd: { type: Number, required: true },
});

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "converted"], default: "active" },
  },
  { timestamps: true }
);

cartSchema.pre("save", function () {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);

  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0
  );
});

export default models.Cart || model("Cart", cartSchema);

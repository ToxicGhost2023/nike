import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Cart from "@/models/ShopingCart";
import Product from "@/models/Products";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ items: [] });

    const cart = await Cart.findOne({ userId: session.user.id })
      .populate("items.product", "title mainImage brand")
      .lean();
    return NextResponse.json(
      cart || { items: [], totalPrice: 0, totalItems: 0 }
    );
  } catch (error) {
    console.log(error);
  }
}
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.jsin({ message: "login required" }, { status: 401 });
    const { productId, variantId, quantity = 1 } = await req.json();

    const product = await Product.findOne(
      { _id: productId, "variants._id": variantId },
      { "variants.$": 1 }
    );

    if (!product || product.variants[0].stock < quantity) {
      return NextResponse.json(
        { message: "Insufficient inventory" },
        { status: 400 }
      );
    }

    const price = product.variants[0].finalPrice;

    const cart = await Cart.findOneAndUpdate(
      { userId: session.user.id },
      {
        $setOnInsert: { userId: session.user.id },
        $push: {
          items: {
            product: productId,
            variantId,
            quantity,
            priceAtAdd: price,
          },
        },
      },
      { upsert: true, new: true }
    ).populate("items.product", "title mainImage");

    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    console.log(error);
  }
}

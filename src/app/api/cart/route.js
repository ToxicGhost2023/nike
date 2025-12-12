import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Cart from "@/models/ShopingCart";
import Product from "@/models/Products";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }

    const cart = await Cart.findOne({ userId: session.user.id })
      .populate("items.product", "title mainImage brand variants model")
      .lean();

    if (cart) {
      cart.items = cart.items.map((item) => {
        const variant = item.product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );

        return {
          ...item,
          variant, 
        };
      });
    }

    return NextResponse.json(
      cart || {
        items: [],
        totalPrice: 0,
        totalItems: 0,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

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

    const cart = await Cart.findOne({ userId: session.user.id });
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.variantId.toString() === variantId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          variantId,
          quantity,
          priceAtAdd: price,
        });
      }

      await cart.save();
      await cart.populate("items.product", "title mainImage brand");
      return NextResponse.json(cart);
    }
    const newCart = await Cart.create({
      userId: session.user.id,
      items: [
        {
          product: productId,
          variantId,
          quantity,
          priceAtAdd: price,
        },
      ],
    });

    await newCart.populate("items.product", "title mainImage brand");
    return NextResponse.json(newCart);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    const { itemId, quantity } = await req.json();

    if (quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    await cart.populate("items.product", "title mainImage brand");

    return NextResponse.json(cart);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();
    await cart.populate("items.product", "title mainImage brand");

    return NextResponse.json(cart);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

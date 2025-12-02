// app/api/products/[id]/route.js
import mongooseDB from "@/lib/mongoosDB";
import Product from "@/models/Products";
import cloudinary from "@/utils/cloudinary";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  try {
    await mongooseDB();
    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.variants) {
      for (const variant of product.variants) {
        for (const image of variant.images) {
          const publicId = image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        }
      }
    }

    await Product.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await mongooseDB();
    const { id } = params;
    const formData = await req.formData();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    const updates = {};
    const fields = ["title", "model", "brand", "category", "description"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) updates[field] = value.toString();
    });
    const variantUpdates = [];
    for (const [key, value] of formData.entries()) {
      const variantMatch = key.match(
        /^variants\[(\d+)\]\[(.+?)\](?:\[(\d+)\])?$/
      );
      if (!variantMatch) continue;

      const variantIndex = parseInt(variantMatch[1]);
      const fieldName = variantMatch[2];

      if (!variantUpdates[variantIndex]) {
        variantUpdates[variantIndex] = {
          color: product.variants[variantIndex]?.color || "",
          colorCode: product.variants[variantIndex]?.colorCode || "",
          size: product.variants[variantIndex]?.size || "",
          price: product.variants[variantIndex]?.price || 0,
          discount: product.variants[variantIndex]?.discount || 0,
          stock: product.variants[variantIndex]?.stock || 0,
          sku: product.variants[variantIndex]?.sku || "",
          images: [...(product.variants[variantIndex]?.images || [])],
        };
      }

      if (fieldName === "images" && value instanceof File && value.size > 0) {
        const arrayBuffer = await value.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const result = await cloudinary.uploader.upload(
          `data:${value.type};base64,${base64}`,
          {
            folder: "products",
          }
        );
        variantUpdates[variantIndex].images.push(result.secure_url);
      } else if (["price", "discount", "stock"].includes(fieldName)) {
        variantUpdates[variantIndex][fieldName] = Number(value) || 0;
      } else {
        variantUpdates[variantIndex][fieldName] = value.toString();
      }
    }
    const finalUpdates = {
      ...updates,
      variants: variantUpdates.filter(Boolean),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, finalUpdates, {
      new: true,
      runValidators: true,
    });

    return Response.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
export async function GET(req, { params }) {
  try {
    await mongooseDB();
    const { id } = params;

    const product = await Product.findById(id).lean();

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Get product error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

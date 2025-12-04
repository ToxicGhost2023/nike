// app/api/products/route.js

import mongooseDB from "@/lib/mongoosDB";
import Product from "@/models/Products";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  try {
    await mongooseDB();
    const formData = await req.formData();

    const productData = {
      title: formData.get("title")?.toString().trim(),
      model: formData.get("model")?.toString().trim(),
      brand: formData.get("brand")?.toString(),
      category: formData.get("category")?.toString(),
      description: formData.get("description")?.toString(),
      bestSeller: formData.get("bestSeller") === "true",
    };

    const variantsMap = {};

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^variants\[(\d+)\]\[(\w+)\]$/);

      if (match) {
        const index = match[1];
        const field = match[2];

        if (!variantsMap[index]) {
          variantsMap[index] = { images: [] };
        }

        if (field === "images" && value instanceof File) {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Data = `data:${value.type};base64,${buffer.toString(
            "base64"
          )}`;

          const uploadResult = await cloudinary.uploader.upload(base64Data, {
            folder: "products_store",
          });

          variantsMap[index].images.push(uploadResult.secure_url);
        } else if (field !== "images") {
          if (["price", "discount", "stock"].includes(field)) {
            variantsMap[index][field] = Number(value) || 0;
          } else {
            variantsMap[index][field] = value;
          }
        }
      }
    }

    const variants = Object.values(variantsMap);

    if (variants.length === 0) {
      return Response.json(
        { error: "At least one variant is required" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      ...productData,
      variants,
    });

    return Response.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Product Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await mongooseDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 12);
    const search = searchParams.get("search")?.trim();
    const brand = searchParams.get("brand")?.trim();
    const category = searchParams.get("category")?.trim();
    const color = searchParams.get("color")?.trim();
    const bestSeller = searchParams.get("bestSeller");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (brand) {
      filter.brand = brand;
    }
    if (category) {
      filter.category = category;
    }
    if (bestSeller === "true") {
      filter.bestSeller = true;
    }
    if (color) {
      filter["variants.colorCode"] = color;
    }
    if (minPrice || maxPrice) {
      filter["variants.price"] = {};
      if (minPrice) {
        filter["variants.price"].$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter["variants.price"].$lte = Number(maxPrice);
      }
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET Products Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

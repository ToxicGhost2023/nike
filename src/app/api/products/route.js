import mongooseDB from "@/lib/mongoosDB";
import Product from "@/models/Products";
import cloudinary from "@/utils/cloudinary";

// ===================== POST - Create Product =====================
export async function POST(req) {
  try {
    await mongooseDB();
    const formData = await req.formData();

    const productFields = {
      title: formData.get("title")?.toString().trim() || "",
      model: formData.get("model")?.toString().trim() || "",
      brand: formData.get("brand")?.toString() || "Nike",
      category: formData.get("category")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      bestSeller: formData.get("bestSeller") === "true" || false,
    };

    const variantGroups = {};

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^variants\[(\d+)\]\[(.+?)\](?:\[(\d+)\])?$/);
      if (!match) continue;

      const idx = match[1];
      const field = match[2];

      if (!variantGroups[idx]) {
        variantGroups[idx] = {
          colorName: "",
          colorCode: "",
          size: "",
          price: 0,
          discount: 0,
          stock: 0,
          sku: "",
          images: [],
        };
      }

      if (field === "images" && value instanceof File && value.size > 0) {
        const arrayBuffer = await value.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const result = await cloudinary.uploader.upload(
          `data:${value.type};base64,${base64}`,
          {
            folder: "products",
          }
        );
        variantGroups[idx].images.push(result.secure_url);
      } else if (field !== "images") {
        if (["price", "discount", "stock"].includes(field)) {
          variantGroups[idx][field] = Number(value) || 0;
        } else {
          variantGroups[idx][field] = value.toString();
        }
      }
    }

    const variants = Object.values(variantGroups).filter(
      (v) => v.colorName && v.size && v.price > 0
    );

    if (variants.length === 0) {
      return Response.json(
        { success: false, error: "At least one valid variant is required" },
        { status: 400 }
      );
    }

    // محاسبه finalPrice برای هر variant
    variants.forEach((variant) => {
      if (variant.discount > 0) {
        variant.finalPrice =
          variant.price - (variant.price * variant.discount) / 100;
      } else {
        variant.finalPrice = variant.price;
      }
    });

    // تنظیم mainImage از اولین variant
    if (!productFields.mainImage && variants[0]?.images?.length > 0) {
      productFields.mainImage = variants[0].images[0];
    }

    const product = await Product.create({ ...productFields, variants });

    return Response.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ===================== GET - Fetch Products =====================
export async function GET(req) {
  try {
    await mongooseDB();
    const { searchParams } = new URL(req.url);

    // دریافت پارامترها با validation
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 12)
    );

    // ساخت فیلتر
    const filter = {};

    // Search (جستجو در چند فیلد)
    const search = searchParams.get("search");
    if (
      search &&
      search.trim() &&
      search !== "undefined" &&
      search !== "null"
    ) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { brand: { $regex: search.trim(), $options: "i" } },
        { model: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Brand filter
    const brand = searchParams.get("brand");
    if (brand && brand !== "undefined" && brand !== "null" && brand !== "all") {
      filter.brand = brand;
    }

    // Category filter
    const category = searchParams.get("category");
    if (
      category &&
      category !== "undefined" &&
      category !== "null" &&
      category !== "all"
    ) {
      filter.category = category;
    }

    // Color filter (colorCode)
    const color = searchParams.get("color");
    if (color && color !== "undefined" && color !== "null") {
      filter["variants.colorCode"] = color;
    }

    // Size filter
    const size = searchParams.get("size");
    if (size && size !== "undefined" && size !== "null") {
      filter["variants.size"] = size;
    }

    // Best Seller filter
    const bestSeller = searchParams.get("bestSeller");
    if (bestSeller === "true") {
      filter.bestSeller = true;
    }

    // Price Range Filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (minPrice || maxPrice) {
      filter["variants.finalPrice"] = {};

      if (
        minPrice &&
        minPrice !== "undefined" &&
        minPrice !== "null" &&
        !isNaN(Number(minPrice))
      ) {
        filter["variants.finalPrice"].$gte = Number(minPrice);
      }

      if (
        maxPrice &&
        maxPrice !== "undefined" &&
        maxPrice !== "null" &&
        !isNaN(Number(maxPrice))
      ) {
        filter["variants.finalPrice"].$lte = Number(maxPrice);
      }

      // اگر هیچ کدوم معتبر نبودن، فیلتر قیمت رو حذف کن
      if (Object.keys(filter["variants.finalPrice"]).length === 0) {
        delete filter["variants.finalPrice"];
      }
    }

    console.log("📊 Filter applied:", JSON.stringify(filter, null, 2));

    // اجرای query با pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "title model brand category variants mainImage totalStock likes bestSeller description"
        )
        .lean(),
      Product.countDocuments(filter),
    ]);

    return Response.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Get products error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ===================== DELETE - Delete Product =====================
export async function DELETE(req) {
  try {
    await mongooseDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // حذف تصاویر از Cloudinary
    const allImages = product.variants.flatMap((v) => v.images || []);
    if (product.mainImage) allImages.push(product.mainImage);

    for (const imageUrl of allImages) {
      try {
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    await Product.findByIdAndDelete(id);

    return Response.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ===================== PATCH - Update Product =====================
export async function PATCH(req) {
  try {
    await mongooseDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const updateFields = {
      title: formData.get("title")?.toString().trim(),
      model: formData.get("model")?.toString().trim(),
      brand: formData.get("brand")?.toString(),
      category: formData.get("category")?.toString(),
      description: formData.get("description")?.toString(),
      bestSeller: formData.get("bestSeller") === "true",
    };

    // حذف فیلدهای undefined
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === undefined) delete updateFields[key];
    });

    // اگر variants جدید داره، پردازش کن
    const variantGroups = {};
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^variants\[(\d+)\]\[(.+?)\](?:\[(\d+)\])?$/);
      if (!match) continue;

      const idx = match[1];
      const field = match[2];

      if (!variantGroups[idx]) {
        variantGroups[idx] = {
          colorName: "",
          colorCode: "",
          size: "",
          price: 0,
          discount: 0,
          stock: 0,
          sku: "",
          images: [],
        };
      }

      if (field === "images" && value instanceof File && value.size > 0) {
        const arrayBuffer = await value.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const result = await cloudinary.uploader.upload(
          `data:${value.type};base64,${base64}`,
          { folder: "products" }
        );
        variantGroups[idx].images.push(result.secure_url);
      } else if (field !== "images") {
        if (["price", "discount", "stock"].includes(field)) {
          variantGroups[idx][field] = Number(value) || 0;
        } else {
          variantGroups[idx][field] = value.toString();
        }
      }
    }

    if (Object.keys(variantGroups).length > 0) {
      const variants = Object.values(variantGroups).filter(
        (v) => v.colorName && v.size && v.price > 0
      );

      variants.forEach((variant) => {
        if (variant.discount > 0) {
          variant.finalPrice =
            variant.price - (variant.price * variant.discount) / 100;
        } else {
          variant.finalPrice = variant.price;
        }
      });

      updateFields.variants = variants;
    }

    const product = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, product }, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

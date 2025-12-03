import mongooseDB from "@/lib/mongoosDB";
import Product from "@/models/Products";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  try {
    await mongooseDB();
    const formData = await req.formData();

    // 1. Extract basic info
    const productData = {
      title: formData.get("title")?.toString().trim(),
      model: formData.get("model")?.toString().trim(),
      brand: formData.get("brand")?.toString(),
      category: formData.get("category")?.toString(),
      description: formData.get("description")?.toString(),
      bestSeller: formData.get("bestSeller") === "true",
    };

    // 2. Process Variants and Images
    // We need to group form entries by index: variants[0][color], variants[0][images]...
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
          // Handle Image Upload to Cloudinary
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
          // Handle Text Fields
          if (["price", "discount", "stock"].includes(field)) {
            variantsMap[index][field] = Number(value) || 0;
          } else {
            variantsMap[index][field] = value;
          }
        }
      }
    }

    // Convert map to array
    const variants = Object.values(variantsMap);

    if (variants.length === 0) {
      return Response.json(
        { error: "At least one variant is required" },
        { status: 400 }
      );
    }

    // 3. Save to DB
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
    const search = searchParams.get("search");

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
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
    return Response.json({ error: error.message }, { status: 500 });
  }
}

import mongooseDB from "@/lib/mongoosDB";
import Product from "@/models/Products";
import cloudinary from "@/utils/cloudinary";

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
    };

    const variantGroups = {};

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^variants\[(\d+)\]\[(.+?)\](?:\[(\d+)\])?$/);
      if (!match) continue;

      const idx = match[1];
      const field = match[2];

      if (!variantGroups[idx]) {
        variantGroups[idx] = {
          color: "",
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
      (v) => v.color && v.size && v.price > 0
    );

    if (variants.length === 0) {
      return Response.json(
        { success: false, error: "At least one valid variant is required" },
        { status: 400 }
      );
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

export const GET = async (req) => {
  try {
    await mongooseDB();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);
    const filter = {};

    ["category", "color", "size", "minPrice", "maxPrice", "search"].forEach(
      (param) => {
        const val = searchParams.get(param);
        if (val) {
          if (param === "color") filter["variants.color"] = val;
          else if (param === "size") filter["variants.size"] = val;
          else if (param === "minPrice")
            filter["variants.finalPrice"] = {
              ...(filter["variants.finalPrice"] || {}),
              $gte: Number(val),
            };
          else if (param === "maxPrice")
            filter["variants.finalPrice"] = {
              ...(filter["variants.finalPrice"] || {}),
              $lte: Number(val),
            };
          else if (param === "search") filter.$text = { $search: val };
          else filter[param] = val;
        }
      }
    );

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "title model brand category variants mainImage totalStock likes bestSeller"
      )
      .lean();

    const total = await Product.countDocuments(filter);

    return Response.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

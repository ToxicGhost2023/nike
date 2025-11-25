// app/api/products/route.js
import Product from "@/models/Product";
import connectDB from "@/lib/connectDB";

// اتصال به دیتابیس (یکبار)
connectDB();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    // فیلترهای پیشرفته
    let filter = {};

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$text = { $search: search };
    }

    // فیلتر قیمت روی finalPrice واریانت‌ها
    if (minPrice || maxPrice) {
      filter["variants.finalPrice"] = {};
      if (minPrice) filter["variants.finalPrice"].$gte = Number(minPrice);
      if (maxPrice) filter["variants.finalPrice"].$lte = Number(maxPrice);
    }

    // فیلتر رنگ و سایز (حداقل یک واریانت داشته باشه)
    if (color) {
      filter["variants.color"] = color;
    }
    if (size) {
      filter["variants.size"] = size;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title model brand category gender mainImage availableColors availableSizes totalStock bestSeller variants.finalPrice variants.discount"
      )
      .lean();

    const total = await Product.countDocuments(filter);

    return Response.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ایجاد محصول جدید (ادمین)
export async function POST(request) {
  try {
    const body = await request.json();

    const product = await Product.create(body);

    return Response.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

import clientPromise from "@/lib/connectDB";
import { UserModel } from "@/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();

    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return Response.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("nikey");
    const users = db.collection(UserModel.collectionName);
    const exist = await users.findOne({ email: email.toLowerCase() });
    if (exist) {
      return Response.json(
        { message: "Email already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await users.insertOne(
      UserModel.userDocument({
        fullName,
        email,
        password: hashed,

        role: "user",
      })
    );

    return Response.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

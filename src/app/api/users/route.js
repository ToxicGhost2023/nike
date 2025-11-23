import clientPromise from "@/lib/connectDB";
import { UserModel } from "@/models/UserModel";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nikey");
    const users = db.collection(UserModel.collectionName);
    const data = await users
      .find({}, { projection: { password: 0 } })
      .toArray();

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

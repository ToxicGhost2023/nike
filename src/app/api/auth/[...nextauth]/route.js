import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import clientPromise from "@/lib/connectDB";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("nikey");
        const users = db.collection("users");

        const user = await users.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.fullName = user.fullName || profile?.name || "";
        token.role = user.role || "user";
      }
      if (account?.provider === "google") {
        const client = await clientPromise;
        const db = client.db("nikey");
        const users = db.collection("users");

        const existing = await users.findOne({
          email: token.email.toLowerCase(),
        });

        if (!existing) {
          const newUser = {
            fullName: profile.name,
            email: profile.email.toLowerCase(),
            password: null,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await users.insertOne(newUser);

          token.role = "user";
        } else {
          token.role = existing.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.fullName = token.fullName;
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

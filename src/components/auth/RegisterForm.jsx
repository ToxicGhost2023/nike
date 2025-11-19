"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios.post("/api/auth/register", {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
    });

    setLoading(false);
    router.push("/login");
  };

  return (
    <Card className="w-full max-w-md glow-card rounded-2xl p-6">
      <CardHeader>
        <h2 className="text-3xl font-bold text-gn">Create Account</h2>
        <p className="text-sm opacity-70">Join us and enjoy shopping</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4 mt-2">
          <Input
            name="fullName"
            placeholder="Full Name"
            className="rounded-xl"
            required
          />
          <Input
            name="email"
            placeholder="Email"
            className="rounded-xl"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            className="rounded-xl"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gn hover:bg-green text-black font-bold rounded-xl"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <Button
            type="button"
            onClick={() => signIn("google")}
            className="w-full bg-black/70 text-orange-500 hover:bg-black rounded-xl border border-white/10"
          >
            Sign up with Google
          </Button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="opacity-70">Already have an account?</span>{" "}
          <Link
            href="/login"
            className="text-green font-semibold hover:underline"
          >
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

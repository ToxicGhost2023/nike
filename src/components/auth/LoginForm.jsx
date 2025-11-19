"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
    });

    if (res.ok) router.push("/landing");

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md glow-card rounded-2xl p-6">
      <CardHeader>
        <h2 className="text-3xl font-bold text-green">Welcome Back</h2>
        <p className="text-sm opacity-70">Enter your account to continue</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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
            className="w-full bg-green hover:bg-gn text-black font-bold rounded-xl"
          >
            {loading ? "Loading..." : "Login"}
          </Button>

          <Button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/landing" })}
            className="w-full bg-black/70 text-orange-600 hover:bg-black rounded-xl border border-white/10"
          >
            Continue with Google
          </Button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="opacity-70">Don’t have an account?</span>{" "}
          <Link
            href="/register"
            className="text-gn font-semibold hover:underline"
          >
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

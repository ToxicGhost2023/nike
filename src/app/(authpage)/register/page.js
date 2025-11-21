import { Spinner } from "@/components/ui/spinner";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RegisterForm = dynamic(() => import("@/components/auth/RegisterForm"), {
  ssr: false,
});

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<Spinner />}
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <RegisterForm />
    </Suspense>
  );
}

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/auth/LoginForm"), {
  ssr: false,
});

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <LoginForm />
    </div>
  );
}

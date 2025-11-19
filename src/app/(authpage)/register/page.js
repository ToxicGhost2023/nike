import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <RegisterForm />
    </div>
  );
}

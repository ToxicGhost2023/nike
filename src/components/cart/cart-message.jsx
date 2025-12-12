import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartMessage({ type, text }) {
  if (!text) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={cn(
        "mb-4 p-4 rounded-xl flex items-center gap-2",
        isSuccess
          ? "bg-green-50 border border-green-200 text-green-600"
          : "bg-red-50 border border-red-200 text-red-600"
      )}
    >
      {isSuccess ? (
        <Check className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );
}

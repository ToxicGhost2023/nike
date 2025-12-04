// src/app/loading.js
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-[#fffd00] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

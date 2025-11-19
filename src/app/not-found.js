import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-950 via-black to-neutral-900 text-center px-6 text-white overflow-hidden">
      <section className="flex items-center justify-center gap-2 sm:gap-4">
        <span className="text-[100px] sm:text-[150px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_0_25px_rgba(255,204,0,0.3)]">
          4
        </span>

        <div className="mt-[50px] sm:mt-[70px] md:mt-[90px] w-[80px] sm:w-[120px] md:w-[150px] h-[70px] sm:h-[90px] md:h-[100px] flex items-center justify-center pointer-events-none drop-shadow-[0_0_25px_rgba(255,204,0,0.3)]">
          <Image
            src="/images/404.png"
            alt="Watch Background"
            width={600}
            height={600}
            quality={90}
            className="object-contain"
          />
        </div>

        <span className="text-[100px] sm:text-[150px] md:text-[200px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_0_25px_rgba(255,204,0,0.3)]">
          4
        </span>
      </section>
      <p className="mt-6 max-w-md text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-semibold shadow-[0_0_25px_rgba(255,204,0,0.4)] hover:shadow-yellow-400/50 transition-transform duration-300 hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
      <div className="absolute bottom-6 text-xs text-gray-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
        © 2025 WatchStore — Precision in Every Second
      </div>
    </div>
  );
}

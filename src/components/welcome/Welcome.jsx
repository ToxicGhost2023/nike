"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Orb = dynamic(() => import("../reactbits/Orb"), { ssr: false });

import Image from "next/image";

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
        <div className="w-full h-full md:h-[600px] lg:h-[800px] relative">
          <Orb
            hoverIntensity={1.5}
            rotateOnHover={true}
            hue={102}
            forceHoverState={false}
          />
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none">
        <h1 className="text-xl text-green sm:text-xl md:text-2xl lg:text-6xl font-bold mb-4">
          Welcome to Nikey
        </h1>
        <p className="text-base sm:text-sm md:text-sm lg:text-2xl mb-8 max-w-xl sm:max-w-md md:max-w-xl px-4">
          No need to introduce, the best is here.
        </p>
        <div className="flex gap-3 sm:gap-4 flex-wrap justify-center pointer-events-auto">
          <button
            onClick={() => router.push("/landing")}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-black font-light bg-green hover:bg-gn transition duration-500   text-sm sm:text-base"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/auth")}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-white text-black   transition duration-500 font-light text-sm sm:text-base"
          >
            Login / Auth
          </button>
        </div>
        <Image
          className="bg-white rounded-full mt-[30px]"
          width={64}
          height={64}
          alt="nike"
          src="/images/nike.png"
          priority={true}
        />
      </div>
    </div>
  );
}

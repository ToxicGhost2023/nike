import dynamic from "next/dynamic";

// Lazy load کردن کامپوننت‌ها
const HeaderLanding = dynamic(
  () => import("@/components/landing/HeaderLanding"),
  {
    ssr: false, // اگر نمی‌خوای SSR برای این کامپوننت باشه
  }
);

const Banner = dynamic(() => import("@/components/landing/Banner"), {
  ssr: false,
});

const Capabilities = dynamic(
  () => import("@/components/landing/Capabilities"),
  {
    ssr: false,
  }
);

const SliderProducts = dynamic(
  () => import("@/components/landing/SliderProducts"),
  {
    ssr: false,
  }
);

const Footer = dynamic(() => import("@/components/landing/Footer"), {
  ssr: false,
});

function LandingPage() {
  return (
    <div>
      <HeaderLanding />
      <Banner />
      <Capabilities />
      <SliderProducts />
      <Footer />
    </div>
  );
}

export default LandingPage;

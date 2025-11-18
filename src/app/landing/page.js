import Banner from "@/components/landing/Banner";
import Capabilities from "@/components/landing/Capabilities";
import Footer from "@/components/landing/Footer";
import HeaderLanding from "@/components/landing/HeaderLanding";
import React from "react";

function LandingPage() {
  return (
    <div>
      <HeaderLanding />
      <Banner />
      <Capabilities />

      <Footer />
    </div>
  );
}

export default LandingPage;

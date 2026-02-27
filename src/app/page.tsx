"use client";

import React from "react";
import Image from "next/image";

// components
import CTASection from "@/components/CTASection";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OfferingsSection from "@/components/OfferingsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import ParchmentOverlay from "@/components/ui/ParchmentOverlay";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden text-[#3b2411]">
      
      {/* Background */}
      <Image
        src="/image.jpg"
        alt="Background"
        fill
        priority
        className="object-cover -z-20"
      />
      {/* Warm parchment overlay */}
      <ParchmentOverlay />

      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Offerings Section */}
      <OfferingsSection />

      {/* How it works section */}
      <HowItWorksSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />

    </div>
  );
}

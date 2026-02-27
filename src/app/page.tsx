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
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3e3cf]/80 via-[#f3e3cf]/50 to-[#f3e3cf]/80 -z-10" />

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

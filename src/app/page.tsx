"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
];

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
      <header className="absolute top-6 left-1/2 z-30 flex h-14 w-[98%] max-w-7xl -translate-x-1/2 items-center justify-between rounded-full border border-[#5d3919]/20 bg-white/60 px-12 backdrop-blur-xl shadow-lg">
        
        <div className="font-['Jomolhari'] text-xl tracking-[0.2em]">
          TSEDQ
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-sm tracking-wider font-medium transition duration-300 hover:text-[#8b5829]
              after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:w-0 after:bg-[#8b5829]
              after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-[#5d3919]/30 text-[#5d3919] bg-transparent hover:bg-[#5d3919]/10"
            >
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-[#8b5829] hover:bg-[#6d4620] text-white transition hover:-translate-y-0.5">
              Register
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex min-h-screen items-center justify-between w-full px-12 pt-24 gap-16">
        
        {/* Left Content (logo + flexible text) */}
        <div className="flex items-start gap-6 flex-1">

          {/* Logo Circle */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden 
                          border-[1px] border-[#8b5829]/30 bg-[#6d4620] p-4 
                          flex-shrink-0 mt-2">
            <Image
              src="/logo.png"
              alt="TSEDQ Logo"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>

          {/* Text */}
          <div className="flex-1 ml-12 md:ml-20 lg:ml-32">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-['Jomolhari'] text-6xl lg:text-7xl font-bold tracking-wide leading-tight"
            >
              WELCOME TO TSEDQ
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-5 text-xl lg:text-2xl font-semibold leading-relaxed max-w-2xl"
            >
              Empowering Orthodox Communities <br />
              Through Digitalized Faith Giving & Finance
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-6 text-base lg:text-lg text-[#4b2e18] leading-relaxed max-w-2xl"
            >
              TSEDQ is a FaithTech platform that unifies donations, tithing,
              and community contributions using smart automation, blockchain
              transparency, and secure digital payments.
            </motion.p>
          </div>
        </div>

        {/* Right Cross (pinned to right edge) */}
        <div className="absolute right-12 top-[60%] -translate-y-1/2 hidden lg:block w-[320px] h-[680px] pointer-events-none">
          <Image
            src="/2714933a256bdceb53779dcfd80f9ea1f839ed95.png"
            alt="Orthodox Cross"
            fill
            className="object-contain drop-shadow-[0_40px_80px_rgba(139,88,41,0.45)]"
            priority
          />
        </div>

      </main>
    </div>
  );
}
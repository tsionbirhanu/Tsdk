import React from "react";
import Link from "next/link";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#offerings" },
  { label: "About", href: "#how-it-works" },
];

const Navbar = () => (
  <header className="absolute top-6 left-1/2 z-30 flex h-14 w-[98%] max-w-7xl -translate-x-1/2 items-center rounded-full border border-[#5d3919]/20 bg-white/60 px-12 backdrop-blur-xl shadow-lg">
    <div className="font-['Jomolhari'] text-xl tracking-[0.2em]">
      TSEDQ
    </div>

    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
      {navigationLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="relative text-base lg:text-lg tracking-wider font-medium transition duration-300 hover:text-[#8b5829]
              after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:w-0 after:bg-[#8b5829]
              after:transition-all after:duration-300 hover:after:w-full"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  </header>
);

export default Navbar;


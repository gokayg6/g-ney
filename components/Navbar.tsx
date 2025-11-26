"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar: React.FC<{}> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Admin sayfalarında navbar'ı gösterme
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/about", label: "Hakkımda" },
    { href: "/projects", label: "Projeler" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "İletişim" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="w-full h-[65px] bg-[#111]/80 fixed backdrop-blur-xl border-b border-slate-800 z-50 px-4 md:px-10 animate-fade-in transition-colors duration-500 ease-out">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <Link
          title="ibrahim logo"
          href="/"
          className="h-auto w-auto flex flex-row items-center transition-transform duration-200 hover:scale-105"
        >
          <Image
            src="/loegs.png?v=2"
            alt="Loegs.com"
            width={50}
            height={50}
            sizes="50px"
            className="h-[50px] w-auto"
            unoptimized
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex flex-row gap-5 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`z-[1] bg-transparent cursor-pointer hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-5 transition-all duration-200 active:scale-95 ${
                isActive(item.href) 
                  ? "bg-[#2E2E2E] text-white font-semibold shadow-sm" 
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="z-[1] bg-transparent cursor-pointer hover:bg-[#2E2E2E] rounded-xl text-white py-2 px-4 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[65px] left-0 w-full bg-[#111]/95 backdrop-blur-xl border-t border-[#2E2E2E] transition-colors duration-500 ease-out">
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`z-[1] bg-transparent cursor-pointer hover:bg-[#2E2E2E] rounded-xl text-white py-3 px-5 mb-2 transition-colors duration-200 ${
                  isActive(item.href) 
                    ? "bg-[#2E2E2E] text-white font-semibold shadow-sm" 
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;

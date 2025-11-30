"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { FiHome, FiUser, FiBriefcase, FiBookOpen, FiMail, FiMenu, FiX } from "react-icons/fi";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Ana Sayfa", icon: FiHome },
    { href: "/about", label: "Hakkımda", icon: FiUser },
    { href: "/projects", label: "Projeler", icon: FiBriefcase },
    { href: "/blog", label: "Blog", icon: FiBookOpen },
    { href: "/contact", label: "İletişim", icon: FiMail },
  ];

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = useCallback((href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  }, [pathname]);

  // Admin sayfalarında navbar'ı gizle (TÜM hooks'lardan sonra)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Mobile - Bottom Dock Navbar
  if (isMobile) {
    return (
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed bottom-2 left-2 right-2 z-[10000] pointer-events-auto md:hidden"
      >
        <div
          className="relative px-2 py-2 rounded-[20px] backdrop-blur-3xl max-w-md mx-auto"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
          }}
        >
          <div className="flex items-center justify-around gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <DockIcon
                  key={item.href}
                  href={item.href}
                  icon={Icon}
                  active={active}
                  label={item.label}
                />
              );
            })}
          </div>
        </div>
      </motion.nav>
    );
  }

  // Desktop & Tablet - Top Glass Menu
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed top-0 left-0 right-0 z-[10000] pointer-events-auto"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div
          className="rounded-[20px] backdrop-blur-3xl px-3 sm:px-4 md:px-6 py-2 md:py-3"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" prefetch={true} className="flex items-center space-x-2 group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shadow-lg overflow-hidden"
              >
                <Image
                  src="/loegs.png"
                  alt="Loegs"
                  width={36}
                  height={36}
                  className="object-contain"
                  unoptimized
                />
              </motion.div>
              <span className="hidden sm:inline text-white font-semibold text-base sm:text-lg tracking-tight">Loegs</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className="relative px-2 sm:px-3 lg:px-4 py-2 rounded-[12px] text-xs sm:text-sm font-medium transition-all duration-200"
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/20 rounded-[12px]"
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        style={{
                          filter: "drop-shadow(0 0 15px rgba(255,255,255,0.6))",
                        }}
                      />
                    )}
                    <span className="relative flex items-center space-x-1 lg:space-x-2">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden lg:inline whitespace-nowrap">{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// Dock Icon Component with iOS bounce animation
interface DockIconProps {
  href: string;
  icon: React.ElementType;
  active: boolean;
  label: string;
}

const DockIcon: React.FC<DockIconProps> = ({ href, icon: Icon, active, label }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 200, damping: 25 });

  useEffect(() => {
    if (isHovered) {
      scale.set(1.2);
    } else {
      scale.set(1);
    }
  }, [isHovered, scale]);

  return (
    <motion.div
      className="relative flex-1 flex justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => scale.set(1.2)}
      onTouchEnd={() => scale.set(1)}
      style={{ scale: springScale }}
    >
      <Link
        href={href}
        prefetch={true}
        className="relative flex items-center justify-center w-10 h-10 rounded-[12px] transition-all duration-200"
        aria-label={label}
      >
        {active && (
          <motion.div
            layoutId="dockActive"
            className="absolute inset-0 bg-white/20 rounded-[12px]"
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            style={{
              filter: "drop-shadow(0 0 25px rgba(255,255,255,0.6))",
            }}
          />
        )}
        <Icon
          className={`relative w-5 h-5 ${
            active ? "text-white" : "text-white/70"
          } transition-colors duration-200`}
        />
      </Link>
    </motion.div>
  );
};

export default Navbar;

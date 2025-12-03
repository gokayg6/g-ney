"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { FiHome, FiUser, FiBriefcase, FiBookOpen, FiMail, FiMenu, FiX } from "react-icons/fi";
import GlassSurface from "./LiquidGlass/GlassSurface";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const [distortion, setDistortion] = useState(-180);

  useEffect(() => {
    let animationFrame: number;
    if (isHovered) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        setDistortion(-180 + Math.sin(elapsed / 1000) * 10); // Slow oscillation
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setDistortion(-180);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered]);

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
          className="relative max-w-md mx-auto"
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={20}
            borderWidth={0.07}
            brightness={50}
            opacity={0.8}
            blur={20}
            displace={0.5}
            backgroundOpacity={0.15}
            saturation={1}
            distortionScale={-180}
            redOffset={0}
            greenOffset={1}
            blueOffset={2}
            xChannel="R"
            yChannel="G"
            mixBlendMode="difference"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <div className="flex items-center justify-around gap-1 w-full px-2 py-2">
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
          </GlassSurface>
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
      <div className="w-fit mx-auto mt-4">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="transition-all duration-300 ease-in-out"
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={40}
            borderWidth={0.07}
            brightness={50}
            opacity={isHovered ? 0.93 : 0.6}
            blur={isHovered ? 25 : 15}
            displace={isHovered ? 1.5 : 0.8}
            backgroundOpacity={isHovered ? 0.2 : 0.1}
            saturation={1}
            distortionScale={distortion}
            redOffset={0}
            greenOffset={1}
            blueOffset={2}
            xChannel="R"
            yChannel="G"
            mixBlendMode="difference"
            style={{ boxShadow: 'none', border: '1px solid rgba(255, 255, 255, 0.3)' }}
          >
            <div className="flex items-center justify-between gap-8 px-6 py-2">
              {/* Logo */}
              <Link href="/" prefetch={true} className="flex items-center space-x-2 group flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
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
              <div className="flex items-center space-x-1 lg:space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      className="relative px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-white/10"
                    >
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white/20 rounded-full"
                          transition={{ type: "spring", stiffness: 200, damping: 25 }}
                          style={{
                            filter: "drop-shadow(0 0 15px rgba(255,255,255,0.6))",
                          }}
                        />
                      )}
                      <span className="relative flex items-center space-x-2">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden lg:inline whitespace-nowrap">{item.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </GlassSurface>
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
          className={`relative w-5 h-5 ${active ? "text-white" : "text-white/70"
            } transition-colors duration-200`}
        />
      </Link>
    </motion.div>
  );
};

export default Navbar;

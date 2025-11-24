"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  showLogo?: boolean;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  description,
  image = "/loegs.png",
  showLogo = true,
}) => {
  // Glassmorphism blur animasyonu için motion values
  const blurProgress = useMotionValue(20);
  const backdropBlur = useTransform(blurProgress, (value) => `blur(${value}px) saturate(180%)`);
  const opacityProgress = useMotionValue(0.5);
  const containerOpacity = useTransform(opacityProgress, [0.5, 1], [0.5, 1]);
  
  // Blur ve opacity animasyonunu başlat
  useEffect(() => {
    const blurAnimation = animate(blurProgress, 0, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    });
    
    const opacityAnimation = animate(opacityProgress, 1, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    });
    
    return () => {
      blurAnimation.stop();
      opacityAnimation.stop();
    };
  }, [blurProgress, opacityProgress]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-20 relative">
      {/* Hero Container - iOS tarzı glassmorphism kart */}
      <motion.div
        className="relative w-full max-w-5xl mx-auto"
        initial={{
          scale: 1.08,
          opacity: 0.85,
        }}
        animate={{
          scale: 1.0,
          opacity: 1.0,
        }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 30,
          mass: 1.5,
          duration: 0.8,
        }}
      >
        {/* Hero Kartı - iOS Glassmorphism efekti */}
        <div 
          className="relative overflow-hidden rounded-[2rem]"
          style={{
            backdropFilter: backdropBlur,
            WebkitBackdropFilter: backdropBlur,
            opacity: containerOpacity,
          }}
        >
          {/* Glassmorphism arka plan katmanı - Light/Dark */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 dark:from-white/5 via-white/85 dark:via-white/5 to-white/80 dark:to-white/5 rounded-[2rem] border border-slate-200 dark:border-white/20 shadow-2xl dark:shadow-xl pointer-events-none transition-colors duration-500" />
          
          {/* İçerik container */}
          <div className="relative p-10 md:p-16 lg:p-20 z-10">
            {/* Logo */}
            {showLogo && (
              <motion.div
                className="flex justify-center mb-10"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.15,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 dark:bg-white/10 rounded-full blur-xl" />
                  <Image
                    priority
                    src={image}
                    height={160}
                    width={160}
                    alt={title}
                    className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] object-contain drop-shadow-2xl"
                    unoptimized
                  />
                </div>
              </motion.div>
            )}

            {/* Başlık */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 dark:text-white mb-8 leading-[1.1] text-center tracking-tight transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: showLogo ? 0.25 : 0.15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="font-extralight">{title}</span>
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.div
                className="flex justify-center items-center flex-wrap gap-2 mb-8"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: showLogo ? 0.35 : 0.25,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="text-xl md:text-3xl font-light tracking-tight text-slate-700 dark:text-white/90 transition-colors duration-500">
                  <span className="text-transparent font-normal bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 dark:from-purple-300 dark:via-pink-300 dark:to-orange-300">
                    {subtitle}
                  </span>
                </p>
              </motion.div>
            )}

            {/* Açıklama */}
            {description && (
              <motion.p
                className="text-base md:text-lg text-slate-600 dark:text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto text-center font-light whitespace-pre-line transition-colors duration-500"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: showLogo ? 0.45 : 0.35,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PageHero;


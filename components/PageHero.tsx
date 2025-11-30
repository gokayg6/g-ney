"use client";

import React from "react";
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

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-20 relative">
      {/* Hero Container - iOS tarzı glassmorphism kart */}
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Hero Kartı - iOS Glassmorphism efekti */}
        <div 
          className="relative overflow-hidden rounded-[2rem]"
        >
          {/* Glassmorphism arka plan katmanı - Light/Dark */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 dark:from-white/5 via-white/85 dark:via-white/5 to-white/80 dark:to-white/5 rounded-[2rem] border border-slate-200 dark:border-white/20 shadow-2xl dark:shadow-xl pointer-events-none transition-colors duration-500" />
          
          {/* İçerik container */}
          <div className="relative p-6 md:p-10 lg:p-12 z-10">
            {/* Logo */}
            {showLogo && (
              <div className="flex justify-center mb-10">
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
              </div>
            )}

            {/* Başlık */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 dark:text-white mb-6 sm:mb-8 leading-[1.1] text-center tracking-tight transition-colors duration-500 px-2">
              <span className="font-extralight">{title}</span>
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <div className="flex justify-center items-center flex-wrap gap-2 mb-6 sm:mb-8 px-2">
                <p className="text-lg sm:text-xl md:text-3xl font-light tracking-tight text-slate-700 dark:text-white/90 transition-colors duration-500">
                  <span className="text-transparent font-normal bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 dark:from-purple-300 dark:via-pink-300 dark:to-orange-300">
                    {subtitle}
                  </span>
                </p>
              </div>
            )}

            {/* Açıklama */}
            {description && (
              <p className="text-base md:text-lg text-slate-600 dark:text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto text-center font-light whitespace-pre-line transition-colors duration-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHero;


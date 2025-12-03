"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HeroData } from "@/lib/data";

const HomeHero: React.FC = () => {
  const [data, setData] = useState<HeroData>({
    name: "Loegs.com",
    tagline: "kodlama &",
    taglineHighlight: "Programlama",
    description: "React Native geliştirme odaklı tutkulu bir yazılım mühendisi, zarif ve kullanıcı dostu mobil uygulamalar yaratmaya adanmış.",
    buttonText: "İletişime Geç",
    buttonLink: "mail:exapmle@exapmle.com",
    image: "/loegs.png",
  });

  // API'den veri çek
  useEffect(() => {
    fetch("/api/content/hero")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          // Sadece description ve diğer içerik alanlarını güncelle, başlıkları koru
          setData((prevData) => ({
            ...prevData,
            description: data.description || prevData.description,
            buttonText: data.buttonText || prevData.buttonText,
            buttonLink: data.buttonLink || prevData.buttonLink,
            image: data.image || prevData.image,
          }));
        }
      })
      .catch(() => {
        // Silent fail - başlangıç değerlerini koru
      });
  }, []);

  // Glassmorphism blur animasyonu için state değerleri
  const [backdropBlur, setBackdropBlur] = useState("blur(20px) saturate(180%)");
  const [containerOpacity, setContainerOpacity] = useState(0.5);

  // Motion values - component seviyesinde tanımlanmalı
  const blurProgress = useMotionValue(20);
  const opacityProgress = useMotionValue(0.5);

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

    // Motion value'ları state'e dönüştür
    const unsubscribeBlur = blurProgress.on("change", (value) => {
      setBackdropBlur(`blur(${value}px) saturate(180%)`);
    });

    const unsubscribeOpacity = opacityProgress.on("change", (value) => {
      setContainerOpacity(value);
    });

    return () => {
      blurAnimation.stop();
      opacityAnimation.stop();
      unsubscribeBlur();
      unsubscribeOpacity();
    };
  }, [blurProgress, opacityProgress]);



  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-20 relative mt-16 md:mt-20">
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
        style={{ position: 'relative', zIndex: 1 }}
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
          <div className="relative p-8 md:p-12 lg:p-16 z-10">
            {/* Logo - Daha zarif animasyon */}
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
                  src={data.image || "/loegs.png"}
                  height={160}
                  width={160}
                  alt={data.name}
                  className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] object-contain drop-shadow-2xl"
                  unoptimized
                />
              </div>
            </motion.div>

            {/* Başlık - Daha zarif tipografi */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 dark:text-white mb-8 leading-[1.1] text-center tracking-tight transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.25,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="font-extralight">{data.name}</span>
            </motion.h1>

            {/* Tagline - Daha zarif gradient */}
            <motion.div
              className="flex justify-center items-center flex-wrap gap-2 mb-8"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <p className="text-xl md:text-3xl font-light tracking-tight text-slate-700 dark:text-white/90 transition-colors duration-500">
                {data.tagline}{" "}
                <span className="text-transparent font-normal bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 dark:from-purple-300 dark:via-pink-300 dark:to-orange-300">
                  {data.taglineHighlight}
                </span>
              </p>
            </motion.div>

            {/* Açıklama - Daha zarif spacing */}
            <motion.p
              className="text-base md:text-lg text-slate-600 dark:text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto text-center font-light transition-colors duration-500"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.45,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {data.description}
            </motion.p>

            {/* Butonlar Container - Glassmorphism butonlar */}
            <motion.div
              className="home-hero-buttons flex flex-col sm:flex-row gap-4 md:gap-5 relative"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.55,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
            >
              {/* Primary Button - Glassmorphism efekti */}
              <Link
                href="/projects"
                className="flex-1 relative overflow-hidden group
                         bg-slate-50 dark:bg-white/10 backdrop-blur-xl
                         border-2 border-slate-300 dark:border-white/20
                         text-slate-900 dark:text-white font-semibold py-4 px-8 
                         rounded-2xl
                         shadow-xl dark:shadow-lg hover:shadow-2xl hover:border-slate-400 dark:hover:border-white/30
                         transition-all duration-300
                         cursor-pointer
                         select-none
                         active:scale-[0.98]
                         touch-action: manipulation
                         inline-flex items-center justify-center
                         no-underline"
                style={{
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  position: "relative",
                  isolation: "isolate",
                  pointerEvents: 'auto',
                  zIndex: 10,
                }}
              >
                {/* Hover efekti için gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/0 dark:from-white/0 via-slate-200/30 dark:via-white/10 to-slate-100/0 dark:to-white/0 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10 block">Projelerimi Gör</span>
              </Link>

              {/* Secondary Button - Glassmorphism efekti */}
              <Link
                href="/contact"
                className="flex-1 relative overflow-hidden group
                         bg-white dark:bg-white/5 backdrop-blur-xl
                         border-2 border-slate-300 dark:border-white/15
                         text-slate-900 dark:text-white font-semibold py-4 px-8 
                         rounded-2xl
                         shadow-xl dark:shadow-lg hover:shadow-2xl hover:border-slate-400 dark:hover:border-white/25
                         transition-all duration-300
                         cursor-pointer
                         select-none
                         active:scale-[0.98]
                         touch-action: manipulation
                         inline-flex items-center justify-center
                         no-underline"
                style={{
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  position: "relative",
                  isolation: "isolate",
                  pointerEvents: 'auto',
                  zIndex: 10,
                }}
              >
                {/* Hover efekti için gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/0 dark:from-white/0 via-slate-100/20 dark:via-white/10 to-slate-50/0 dark:to-white/0 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10 block">{data.buttonText || "İletişime Geç"}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeHero;


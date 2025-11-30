"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HeroData } from "@/lib/data";

const Banner: React.FC<{}> = () => {
  const [data, setData] = useState<HeroData>({
    name: "Loegs.com",
    tagline: "kodlama &",
    taglineHighlight: "Programlama",
    description: "Passionate Software Engineer with a focus on React Native development, dedicated to crafting elegant and user-friendly mobile applications.",
    buttonText: "İletişime Geç",
    buttonLink: "mail:exapmle@exapmle.com",
    image: "/loegs.png",
  });
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/content/hero")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => {
        // Fallback data
        setData({
          name: "Loegs.com",
          tagline: "kodlama &",
          taglineHighlight: "Programlama",
          description: "Passionate Software Engineer with a focus on React Native development, dedicated to crafting elegant and user-friendly mobile applications.",
          buttonText: "İletişime Geç",
          buttonLink: "mail:exapmle@exapmle.com",
          image: "/loegs.png",
        });
      });
  }, []);

  const handleContactClick = () => {
    // If on home page, scroll to contact section
    if (pathname === "/") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // If contact section not found, navigate to contact page
        router.push("/contact");
      }
    } else {
      // If on another page, navigate to home page first
      router.push("/");
      // After navigation, wait a bit and then scroll to contact section
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // If still not found, navigate to contact page
          router.push("/contact");
        }
      }, 300);
    }
  };


  return (
    <div className="flex flex-row items-center justify-center px-4 md:px-20 mt-[100px] z-[20]">
      <div className="flex flex-col justify-center text-center w-full max-w-[1200px]">
        <div className="justify-center flex animate-zoom-in">
          <Image
            priority
            src="/loegs.png?v=2"
            height={150}
            width={150}
            alt="Loegs.com"
            className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-contain"
            unoptimized
          />
        </div>

        <div className="flex flex-col gap-6 mt-10 cursor-pointer tracking-tighter text-4xl md:text-6xl lg:text-7xl font-semibold text-white max-w-[600px] w-auto h-auto mx-auto animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {data.name}
        </div>
        <div className="flex justify-center items-center flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <p className="text-lg md:text-2xl font-medium tracking-tighter text-gray-300 max-w-[600px]">
            {data.tagline}{" "}
            <span className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-purple-500 to-orange-400">
              {data.taglineHighlight}
            </span>
          </p>
          
        </div>

        <p className="text-sm md:text-base text-gray-200 my-5 max-w-[600px] mx-auto px-4 animate-slide-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          {data.description}
        </p>
        <div className="text-sm md:text-base flex justify-center">
          <button
            onClick={handleContactClick}
            className="z-[1] padding-20 hover:bg-white rounded-3xl text-white font-semibold hover:text-black py-3 px-6 md:px-10 border-[0.1px] border-white hover:border-transparent transition-all duration-150 active:scale-95 animate-slide-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            {data.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;

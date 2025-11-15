"use client";

import React, { useEffect, useState, useRef } from "react";
import { AboutData } from "@/lib/data";

const About: React.FC<{}> = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => {
        // Fallback data
        setData({
          title: "ABOUT ME",
          subtitle: "EXPLORE NOW",
          description: "As a passionate software engineer, I thrive on the intricate dance between logic and creativity. Currently immersed in the dynamic world of WebHR, my expertise centers around React Native, where I seamlessly blend technology with innovation.\n\nWith a fervor for crafting elegant solutions, I navigate the ever-evolving landscape of software development. My journey involves translating concepts into code, creating seamless user experiences, and constantly pushing the boundaries of what's possible",
        });
      });

  }, []);

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</div>;
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden px-4 py-20"
    >
      <div className="flex flex-col justify-center items-center max-w-[900px] w-full gap-6">
        <h1 className="text-white font-semibold text-4xl md:text-5xl lg:text-6xl text-center animate-zoom-in">
          {data.title}
        </h1>
        <p className="tracking-[0.5em] text-transparent font-light bg-clip-text bg-gradient-to-r from-purple-700 to-orange-500 text-sm md:text-lg lg:text-xl text-center animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {data.subtitle}
        </p>
        <p className="text-gray-300 text-center text-sm md:text-base lg:text-lg whitespace-pre-line animate-slide-up max-w-3xl" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          {data.description}
        </p>
      </div>
    </section>
  );
};

export default About;

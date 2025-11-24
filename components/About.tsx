"use client";

import React, { useEffect, useState, useRef } from "react";
import { AboutData } from "@/lib/data";
import PageHero from "./PageHero";

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
    return <div className="min-h-screen flex items-center justify-center text-slate-900 dark:text-white transition-colors duration-500">Yükleniyor...</div>;
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden"
    >
      <PageHero
        title={data.title}
        subtitle={data.subtitle}
        description={data.description}
        showLogo={true}
      />
    </section>
  );
};

export default About;

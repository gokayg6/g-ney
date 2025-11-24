"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { ExperienceData } from "@/lib/data";

const Experience: React.FC<{}> = () => {
  const [data, setData] = useState<ExperienceData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/content/experience")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => {
        // Fallback data
        setData({
          title: "EXPERIENCE",
          subtitle: "EXPLORE NOW",
          items: [
            {
              id: "1",
              company: "WebHR",
              companyLogo: "/WebHR.svg",
              position: "Software Engineer",
              period: "May 2022 - Present, United States",
              description: "Currently, I am working on WebHR Mobile Application, WebHR is a Cloud based Social HR Software for SMEs by Verge Systems Inc. WebHR is currently used in over 160 countries world wide by thousands of organizations to manage HR, As a React.js developer with 2.5 year of experience, I have a strong foundation in creating dynamic and responsive mobile and web applications.\n\nMy experience with React Native has allowed me to develop cross-platform mobile applications that run seamlessly on both iOS and Android platforms. Additionally, my proficiency in React.js has equipped me with the skills to create fast, scalable, and dynamic web pages with excellent user experiences. I have a deep understanding of component-based architecture and state management, and I am well-versed in the latest web development trends and technologies.",
              skills: ["React Native", "React", "JavaScript", "Typescript"],
            },
          ],
        });
      });

  }, []);

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-slate-900 dark:text-white transition-colors duration-500">Yükleniyor...</div>;
  }

  return (
    <section ref={sectionRef} id="experience" className="px-4">
      <h2 className="text-slate-900 dark:text-white font-semibold text-center text-4xl md:text-5xl lg:text-6xl pt-[35px] animate-zoom-in transition-colors duration-500">
        {data.title}
      </h2>
      <p className="tracking-[0.5em] text-center text-transparent font-light pb-5 bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500 dark:from-purple-700 dark:to-orange-500 text-sm md:text-lg lg:text-xl animate-fade-in transition-colors duration-500" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {data.subtitle}
      </p>
      <div className="container mx-auto max-w-6xl">
        {data.items.map((item) => (
          <div key={item.id} className="mb-8">
            {/* Experience Kartı */}
            <div className="bg-white/90 dark:bg-transparent backdrop-blur-sm border border-slate-200 dark:border-white/20 rounded-2xl shadow-lg dark:shadow-xl p-6 md:p-8 transition-all duration-500">
              {/* Üst Bilgi - Şirket ve Tarih */}
              <div className="md:flex md:flex-row md:justify-between items-start mb-6 pb-6 border-b border-slate-200 dark:border-white/20">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <Image
                    src={item.companyLogo}
                    height={40}
                    width={40}
                    alt={`${item.company} logo`}
                    className="w-[40px] h-[40px] object-contain"
                  />
                  <div>
                    <p className="text-slate-900 dark:text-slate-50 text-base md:text-lg font-semibold transition-colors duration-500">
                      <span>{item.company}</span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base transition-colors duration-500">
                      {item.position}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base transition-colors duration-500">
                  {item.period}
                </p>
              </div>

              {/* Açıklama */}
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-line mb-6 transition-colors duration-500">
                {item.description}
              </p>

              {/* Skills */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                {item.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-white/5 cursor-pointer rounded-full text-slate-900 dark:text-slate-50 py-2 px-5 border border-slate-200 dark:border-white/20 w-max text-sm md:text-base transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105 shadow-sm dark:shadow-md"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;

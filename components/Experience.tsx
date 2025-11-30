"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExperienceData } from "@/lib/data";

const Experience: React.FC<{}> = () => {
  const [data, setData] = useState<ExperienceData>({
    title: "DENEYİM",
    subtitle: "KEŞFET",
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
  const sectionRef = useRef<HTMLElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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


  return (
    <section ref={ref} id="experience" className="px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ 
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="text-center mb-12"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
        >
          {data.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300"
        >
          {data.subtitle}
        </motion.p>
      </motion.div>
      <div className="container mx-auto max-w-6xl">
        {data.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="mb-8"
          >
            {/* Experience Kartı */}
            <div className="group backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] p-5 md:p-6">
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
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;

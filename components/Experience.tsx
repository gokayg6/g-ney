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
    return <div className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</div>;
  }

  return (
    <section ref={sectionRef} id="experience" className="px-4">
      <h2 className="text-white font-semibold text-center text-4xl md:text-5xl lg:text-6xl pt-[35px] animate-zoom-in">
        {data.title}
      </h2>
      <p className="tracking-[0.5em] text-center text-transparent font-light pb-5 bg-clip-text bg-gradient-to-r from-purple-700 to-orange-500 text-sm md:text-lg lg:text-xl animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {data.subtitle}
      </p>
      <div className="container mx-auto max-w-6xl">
        {data.items.map((item) => (
          <div key={item.id} className="mb-8">
        <div className="md:flex md:flex-row md:justify-between pt-5">
          <div className="flex items-center gap-3">
            <Image
                  src={item.companyLogo}
              height={30}
              width={30}
                  alt={`${item.company} logo`}
                  className="w-[30px] h-[30px]"
            />
                <p className="text-gray-300 text-sm md:text-base">
                  <span className="font-semibold">{item.company} /</span> {item.position}
            </p>
          </div>
              <p className="text-gray-300 md:pt-0 pt-3 text-sm md:text-base">
                {item.period}
          </p>
        </div>

            <p className="text-gray-300 pt-5 text-sm md:text-base whitespace-pre-line">
              {item.description}
            </p>
            <div className="flex-col flex sm:flex-row flex-wrap gap-2">
              {item.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-transparent mt-5 cursor-pointer rounded-3xl text-white py-2 px-5 border border-[#2E2E2E] w-max text-sm md:text-base"
                >
                  {skill}
          </div>
              ))}
          </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;

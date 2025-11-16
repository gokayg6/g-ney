"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { SubdomainProject } from "@/lib/subdomain-data";

interface BiorhythmTemplateProps {
  project: SubdomainProject;
}

export default function BiorhythmTemplate({ project }: BiorhythmTemplateProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  // screenshots'i tek bir değişkende topluyoruz – type safe
  const screenshots = project.screenshots ?? [];
  const hasScreenshots = screenshots.length > 0;

  useEffect(() => {
    const total = screenshots.length;

    if (total <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % total);
    }, 4000);

    return () => clearInterval(interval);
  }, [screenshots.length]);

  return (
    <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center text-white relative overflow-hidden">

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              {/* Logo */}
              {project.logo && (
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 relative">
                    <Image
                      src={project.logo}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                {project.name}
              </h1>

              <p className="text-2xl sm:text-3xl text-gray-300 mb-6 font-light">
                {project.tagline}
              </p>

              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {project.description}
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                {project.appStoreLink && project.appStoreLink.trim().length > 0 && (
                  <a
                    href={project.appStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 hover:bg-white rounded-3xl text-white font-semibold hover:text-black border-[0.1px] border-white hover:border-transparent transition-all duration-150 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span>App Store</span>
                  </a>
                )}

                {project.playStoreLink &&
                  project.playStoreLink.trim().length > 0 && (
                    <a
                      href={project.playStoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 hover:bg-white rounded-3xl text-white font-semibold hover:text-black border-[0.1px] border-white hover:border-transparent transition-all duration-150 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                      <span>Google Play</span>
                    </a>
                  )}
              </div>
            </div>

            {/* Right - iPhone Mockup */}
            <div className="flex items-center justify-center">
              <div className="relative w-[300px] sm:w-[340px] lg:w-[380px]">
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-b from-white to-gray-100 rounded-[48px] p-3 shadow-2xl ring-2 ring-white/30">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-white rounded-full z-20 shadow-md" />

                  {/* Screen */}
                  <div className="relative bg-white rounded-[40px] overflow-hidden aspect-[9/19.5]">
                    {hasScreenshots && (
                      <div className="relative w-full h-full">
                        {screenshots.map((screenshot, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                              currentScreenshot === index
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          >
                            <Image
                              src={screenshot}
                              alt={`${project.name} screenshot ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 border border-white/40">
                          {screenshots.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentScreenshot(index)}
                              className={`transition-all duration-300 rounded-full ${
                                currentScreenshot === index
                                  ? "w-6 h-2 bg-gray-800"
                                  : "w-2 h-2 bg-gray-400"
                              }`}
                              aria-label={`Screenshot ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {project.features && project.features.length > 0 && (
        <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:border-white/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/20">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-white/90 font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}


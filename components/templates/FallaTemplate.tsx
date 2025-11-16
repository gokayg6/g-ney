"use client";

import Image from "next/image";
import type { SubdomainProject } from "@/lib/subdomain-data";

interface FallaTemplateProps {
  project: SubdomainProject;
}

export default function FallaTemplate({ project }: FallaTemplateProps) {
  const screenshots = project.screenshots ?? [];
  const hasScreenshots = screenshots.length > 0;

  return (
    <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center text-white relative overflow-hidden">

      <section className="relative z-10 px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-3">
              {project.category.toUpperCase()}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold mb-4 leading-tight text-white">
              {project.title}
            </h1>
            <p className="text-base text-gray-300 mb-3">{project.tagline}</p>
            <p className="text-sm text-gray-200 leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {project.features.slice(0, 4).map((f) => (
                <div
                  key={f}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-3"
                >
                  <p className="text-xs text-white/90">{f}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.appStoreLink && (
                <a
                  href={project.appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 hover:bg-white rounded-3xl text-white font-semibold hover:text-black border-[0.1px] border-white hover:border-transparent transition-all duration-150 active:scale-95 text-xs uppercase tracking-[0.18em]"
                >
                  iOS App
                </a>
              )}
              {project.playStoreLink && (
                <a
                  href={project.playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 hover:bg-white rounded-3xl text-white font-semibold hover:text-black border-[0.1px] border-white hover:border-transparent transition-all duration-150 active:scale-95 text-xs uppercase tracking-[0.18em]"
                >
                  Android App
                </a>
              )}
            </div>
          </div>

          {/* Right - social feed mockup */}
          <div className="flex justify-center">
            <div className="relative w-[320px] sm:w-[360px]">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-[36px] border border-white/20 shadow-[0_25px_90px_rgba(0,0,0,0.3)] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/20 bg-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-white/20 border border-white/30">
                      {project.logo && (
                        <Image
                          src={project.logo}
                          alt={project.name}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-white">{project.name}</p>
                      <p className="text-[10px] text-white/70">
                        Social Discovery
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-white/70">Now</span>
                </div>

                {/* Feed */}
                <div className="p-3 space-y-3 bg-white/5 max-h-[520px] overflow-y-auto">
                  {/* Hero card */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                    {hasScreenshots && (
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={screenshots[0]}
                          alt={project.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-[11px] font-semibold mb-1 text-white">
                        Discover people who share your interests.
                      </p>
                      <p className="text-[10px] text-white/70 mb-2">
                        Falla groups, events and real-time chat make it easy to
                        join the right circles.
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-white/60">
                        <span>24 new matches</span>
                        <span>● Live communities</span>
                      </div>
                    </div>
                  </div>

                  {/* Small cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
                      <p className="text-[10px] font-semibold mb-1 text-white">
                        Interest-based matching
                      </p>
                      <p className="text-[10px] text-white/70">
                        See only the rooms that match your vibe.
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
                      <p className="text-[10px] font-semibold mb-1 text-white">
                        Private groups
                      </p>
                      <p className="text-[10px] text-white/70">
                        Safe spaces for close communities.
                      </p>
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold mb-1 text-white">
                        Ready to discover your people?
                      </p>
                      <p className="text-[10px] text-white/70">
                        Join in seconds using your social login.
                      </p>
                    </div>
                    <button className="px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-semibold text-white border border-white/30 transition-all">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


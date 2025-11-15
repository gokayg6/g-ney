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
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0b1120] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-10 w-72 h-72 bg-pink-500/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/25 blur-3xl rounded-full" />
      </div>

      <section className="relative z-10 px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-pink-300/80 mb-3">
              {project.category.toUpperCase()}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-base text-slate-300 mb-3">{project.tagline}</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {project.features.slice(0, 4).map((f) => (
                <div
                  key={f}
                  className="bg-slate-900/70 rounded-2xl border border-slate-700 p-3"
                >
                  <p className="text-xs text-slate-200">{f}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.appStoreLink && (
                <a
                  href={project.appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-pink-500 text-xs font-semibold uppercase tracking-[0.18em] shadow-lg shadow-pink-500/40"
                >
                  iOS App
                </a>
              )}
              {project.playStoreLink && (
                <a
                  href={project.playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full border border-slate-500 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200"
                >
                  Android App
                </a>
              )}
            </div>
          </div>

          {/* Right - social feed mockup */}
          <div className="flex justify-center">
            <div className="relative w-[320px] sm:w-[360px]">
              <div className="absolute -inset-4 bg-gradient-to-br from-pink-500/20 via-sky-500/10 to-purple-500/20 blur-2xl rounded-[40px]" />
              <div className="relative bg-slate-950 rounded-[36px] border border-slate-700 shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800 bg-slate-900/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700">
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
                      <p className="text-[11px] font-semibold">{project.name}</p>
                      <p className="text-[10px] text-slate-400">
                        Social Discovery
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Now</span>
                </div>

                {/* Feed */}
                <div className="p-3 space-y-3 bg-slate-950/90 max-h-[520px] overflow-y-auto">
                  {/* Hero card */}
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
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
                      <p className="text-[11px] font-semibold mb-1">
                        Discover people who share your interests.
                      </p>
                      <p className="text-[10px] text-slate-400 mb-2">
                        Falla groups, events and real-time chat make it easy to
                        join the right circles.
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>24 new matches</span>
                        <span>● Live communities</span>
                      </div>
                    </div>
                  </div>

                  {/* Small cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/80 rounded-2xl p-2 border border-slate-800">
                      <p className="text-[10px] font-semibold mb-1">
                        Interest-based matching
                      </p>
                      <p className="text-[10px] text-slate-400">
                        See only the rooms that match your vibe.
                      </p>
                    </div>
                    <div className="bg-slate-900/80 rounded-2xl p-2 border border-slate-800">
                      <p className="text-[10px] font-semibold mb-1">
                        Private groups
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Safe spaces for close communities.
                      </p>
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="mt-3 bg-slate-900 rounded-2xl border border-slate-800 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold mb-1">
                        Ready to discover your people?
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Join in seconds using your social login.
                      </p>
                    </div>
                    <button className="px-3 py-2 rounded-full bg-pink-500 text-[10px] font-semibold">
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

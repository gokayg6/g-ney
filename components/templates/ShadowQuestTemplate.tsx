"use client";

import Image from "next/image";
import type { SubdomainProject } from "@/lib/subdomain-data";

interface ShadowQuestTemplateProps {
  project: SubdomainProject;
}

export default function ShadowQuestTemplate({
  project,
}: ShadowQuestTemplateProps) {
  const screenshots = project.screenshots ?? [];
  const hasScreenshots = screenshots.length > 0;

  const firstScreenshot = screenshots[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white relative overflow-hidden">
      {/* Glow circles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-700/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full" />
      </div>

      <section className="relative z-10 px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-purple-300/70 mb-4">
              {project.category.toUpperCase()}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg text-slate-300 mb-6">{project.tagline}</p>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              {project.techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700 text-xs text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.appStoreLink && (
                <a
                  href={project.appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all"
                >
                  Download on App Store
                </a>
              )}
              {project.playStoreLink && (
                <a
                  href={project.playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-600 hover:border-purple-400 text-sm font-semibold transition-all"
                >
                  Get it on Google Play
                </a>
              )}
            </div>
          </div>

          {/* Right - game mockup */}
          <div className="relative">
            <div className="relative rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-slate-400">
                  {project.name} • Live Preview
                </span>
                <span className="text-xs text-slate-500">FPS 60</span>
              </div>

              <div className="relative aspect-[16/9] bg-black">
                {hasScreenshots && firstScreenshot && (
                  <Image
                    src={firstScreenshot}
                    alt={project.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}

                {/* HUD overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-900/80 rounded-full border border-slate-700">
                        LVL 32
                      </span>
                      <span className="px-2 py-1 bg-slate-900/80 rounded-full border border-slate-700">
                        RAID: ON
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <span className="block w-3/4 h-full bg-purple-500" />
                      </span>
                      <span className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <span className="block w-1/2 h-full bg-emerald-400" />
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900/70 border border-slate-600" />
                      <div className="w-10 h-10 rounded-full bg-slate-900/70 border border-slate-600" />
                      <div className="w-10 h-10 rounded-full bg-slate-900/70 border border-slate-600" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-full border-2 border-purple-500/70 bg-slate-900/60" />
                      <div className="w-16 h-16 rounded-full border-2 border-emerald-500/70 bg-slate-900/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 text-center max-w-md mx-auto">
              Raid sistemi, gerçek zamanlı PvP ve boss savaşları için optimize
              edildi. Shadow Quest, mobilde konsol kalitesinde deneyim sunmayı
              hedefliyor.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

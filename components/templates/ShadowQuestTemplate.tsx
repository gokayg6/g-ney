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
    <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center text-white relative overflow-hidden">

      <section className="relative z-10 px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">
              {project.category.toUpperCase()}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-white">
              {project.title}
            </h1>
            <p className="text-lg text-gray-300 mb-6">{project.tagline}</p>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              {project.techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs text-white/90"
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
                  className="px-6 py-3 hover:bg-white rounded-3xl text-white font-semibold hover:text-black border-[0.1px] border-white hover:border-transparent transition-all duration-150 active:scale-95 text-sm"
                >
                  Download on App Store
                </a>
              )}
              {project.playStoreLink && (
                <a
                  href={project.playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 hover:bg-white rounded-3xl text-white font-semibold hover:text-black border-[0.1px] border-white hover:border-transparent transition-all duration-150 active:scale-95 text-sm"
                >
                  Get it on Google Play
                </a>
              )}
            </div>
          </div>

          {/* Right - game mockup */}
          <div className="relative">
            <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/20 bg-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-white/70">
                  {project.name} • Live Preview
                </span>
                <span className="text-xs text-white/60">FPS 60</span>
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
                  <div className="flex justify-between text-xs text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-lg rounded-full border border-white/30">
                        LVL 32
                      </span>
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-lg rounded-full border border-white/30">
                        RAID: ON
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 h-2 rounded-full bg-black/50 overflow-hidden border border-white/20">
                        <span className="block w-3/4 h-full bg-white/60" />
                      </span>
                      <span className="w-20 h-2 rounded-full bg-black/50 overflow-hidden border border-white/20">
                        <span className="block w-1/2 h-full bg-white/40" />
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg border border-white/30" />
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg border border-white/30" />
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-lg border border-white/30" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-lg" />
                      <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/70 text-center max-w-md mx-auto">
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


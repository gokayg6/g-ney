"use client";

import Image from "next/image";
import type { SubdomainProject } from "@/lib/subdomain-data";

interface LuxeStyleTemplateProps {
  project: SubdomainProject;
}

export default function LuxeStyleTemplate({ project }: LuxeStyleTemplateProps) {
  const screenshots = project.screenshots ?? [];
  const hasScreenshots = screenshots.length > 0;
  const firstScreenshot = hasScreenshots ? screenshots[0] : project.coverImage;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-80 h-80 bg-fuchsia-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full" />
      </div>

      <section className="relative z-10 px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div className="w-full lg:w-[40%]">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80 mb-4">
              {project.category.toUpperCase()}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-base text-slate-300 mb-4">{project.tagline}</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.features.slice(0, 4).map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700 text-xs text-slate-200"
                >
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.appStoreLink && (
                <a
                  href={project.appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-white text-slate-900 text-xs font-semibold tracking-[0.18em] uppercase"
                >
                  iOS Shopping App
                </a>
              )}
              {project.playStoreLink && (
                <a
                  href={project.playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full border border-slate-500 text-xs font-semibold tracking-[0.18em] uppercase text-slate-200"
                >
                  Android Shopping App
                </a>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:w-[60%]">
            <div className="relative rounded-3xl bg-slate-900/80 border border-slate-700 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[11px] text-slate-400 truncate max-w-xs">
                    {project.name.toLowerCase()}.loegs.com
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">LIVE</span>
              </div>

              {/* Content */}
              <div className="relative bg-slate-950">
                {/* Hero */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-4">
                    <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-emerald-300/80">
                      New Drop
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                      Curated Luxury Collections
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Premium pieces, limited drops and a seamless checkout
                      experience—designed for mobile-first shoppers.
                    </p>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-full bg-emerald-500 text-xs font-semibold text-slate-950">
                        Shop Now
                      </button>
                      <button className="px-4 py-2 rounded-full border border-slate-500 text-xs font-semibold text-slate-200">
                        Explore Collections
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2">
                      <span>Free shipping</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>AR Try-On</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>Member-only drops</span>
                    </div>
                  </div>

                  {/* Hero image */}
                  <div className="relative min-h-[220px] sm:min-h-[260px]">
                    {firstScreenshot && (
                      <Image
                        src={firstScreenshot}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Product grid */}
                <div className="p-4 sm:p-6 lg:p-7 border-t border-slate-800 bg-slate-950/95">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Trending Now
                    </h3>
                    <button className="text-[11px] text-slate-400 hover:text-slate-200">
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {screenshots.slice(0, 3).map((shot, idx) => (
                      <div
                        key={shot + idx}
                        className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800"
                      >
                        <div className="relative aspect-[4/5]">
                          <Image
                            src={shot}
                            alt={`${project.name} item ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] text-slate-200 truncate">
                            Luxe Item {idx + 1}
                          </p>
                          <p className="text-[11px] text-emerald-400 font-semibold">
                            ₺{(1299 + idx * 300).toLocaleString("tr-TR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-400 text-center">
              LuxeStyle, tam entegre bir e-ticaret deneyimi sunar: AR deneme,
              öneri sistemi ve tek tıkla ödeme altyapısıyla birlikte.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

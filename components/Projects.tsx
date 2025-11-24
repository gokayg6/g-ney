"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import type { ProjectsData, ProjectItem } from "@/lib/data";
import type { SubdomainProject } from "@/lib/subdomain-data";

const fallbackProjects: ProjectsData = {
  title: "PROJECTS",
  subtitle: "EXPLORE NOW",
  items: [],
};

function getTypeBadge(type: string) {
  switch (type) {
    case "mobile-app-template":
    case "mobile-app":
      return { text: "Mobil Uygulama", color: "from-blue-500 to-cyan-500" };
    case "ecommerce":
      return { text: "E-Ticaret", color: "from-emerald-500 to-teal-500" };
    case "game":
      return { text: "Oyun", color: "from-purple-500 to-pink-500" };
    case "saas":
      return { text: "SaaS", color: "from-orange-500 to-red-500" };
    case "website":
      return { text: "Website", color: "from-indigo-500 to-purple-500" };
    case "web":
    default:
      return { text: "Web Projesi", color: "from-indigo-500 to-purple-500" };
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "mobile-app":
      return "Mobil Uygulama";
    case "ecommerce":
      return "E-Ticaret";
    case "game":
      return "Oyun";
    case "saas":
      return "SaaS";
    case "website":
      return "Website";
    default:
      return "Proje";
  }
}

// Normal proje + subdomain projeyi tek tipe çeviriyoruz
type CombinedProject =
  | (ProjectItem & { isSubdomain: false })
  | (SubdomainProject & { isSubdomain: true });

const Projects: React.FC = () => {
  const [data, setData] = useState<ProjectsData | null>(null);
  const [subdomainProjects, setSubdomainProjects] = useState<SubdomainProject[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Normal projeler
        const res = await fetch("/api/content/projects");
        if (res.ok) {
          const json: ProjectsData = await res.json();
          if (json && Array.isArray(json.items)) {
            setData(json);
          } else {
            setData(fallbackProjects);
          }
        } else {
          setData(fallbackProjects);
        }

        // Subdomain projeleri
        try {
          const contentRes = await fetch("/api/content/subdomainProjects");
          if (contentRes.ok) {
            const subdomainProjs = await contentRes.json();
            const published = Array.isArray(subdomainProjs)
              ? subdomainProjs.filter(
                  (p: SubdomainProject) => p.published !== false
                )
              : [];
            setSubdomainProjects(published);
          } else {
            setSubdomainProjects([]);
          }
        } catch {
          setSubdomainProjects([]);
        }
      } catch {
        setData(fallbackProjects);
        setSubdomainProjects([]);
      }
    }

    loadData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Yükleniyor...
      </div>
    );
  }

  // Tüm projeleri tek listede birleştir
  const allProjects: CombinedProject[] = [
    ...data.items.map((item) => ({ ...item, isSubdomain: false as const })),
    ...subdomainProjects.map((item) => ({ ...item, isSubdomain: true as const })),
  ];

  // Filtreleme
  const filteredProjects = allProjects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "regular") return !project.isSubdomain;

    // Subdomain projeler için category'ye göre filtrele
    if (project.isSubdomain) {
      const subdomainProject = project as SubdomainProject;
      if (subdomainProject.category) {
        return subdomainProject.category === activeFilter;
      }
    }

    // Standart projeler için type'a göre filtrele
    if ("type" in project && project.type) {
      return project.type === activeFilter;
    }

    return false;
  });

  const filters = [
    { id: "all", label: "Tümü" },
    { id: "regular", label: "Standart Projeler" },
    { id: "mobile-app", label: "Mobil Uygulamalar" },
    { id: "saas", label: "SaaS" },
    { id: "web", label: "Web" },
    { id: "game", label: "Oyunlar" },
    { id: "ecommerce", label: "E-Ticaret" },
  ];

  const handleProjectClick = (project: CombinedProject, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (project.isSubdomain) {
      const subdomain = (project as SubdomainProject).subdomain;
      if (subdomain) {
        window.location.href = `/${subdomain}`;
      }
    } else if ("link" in project && project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="px-4 sm:px-6 lg:px-8 py-20 min-h-screen relative"
      style={{ position: "relative", zIndex: 1 }}
    >

      {/* Filters */}
      <div
        className="flex flex-wrap justify-center gap-3 mb-12 px-4 animate-fade-in relative"
        style={{
          animationDelay: "0.2s",
          animationFillMode: "both",
          zIndex: 1000,
          position: "relative",
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveFilter(filter.id);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-900/30 dark:shadow-white/30 scale-105"
                : "bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 hover:bg-white dark:hover:bg-slate-700/80 hover:scale-105 shadow-md dark:shadow-lg"
            }`}
            style={{
              position: "relative",
              zIndex: 1000,
              cursor: "pointer",
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div
        className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{ position: "relative", zIndex: 1 }}
      >
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-600 dark:text-white/60 text-lg">
              Bu kategoride proje bulunamadı.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {filteredProjects.map((project, index) => {
              const subdomainProject = project.isSubdomain
                ? (project as SubdomainProject)
                : null;

              // Subdomain projeler için category'den, standart projeler için type'dan badge al
              let badge;
              if (project.isSubdomain && subdomainProject?.category) {
                badge = getTypeBadge(subdomainProject.category);
              } else {
                const projectTypeKey =
                  "type" in project && project.type ? project.type : "web";
                badge = getTypeBadge(projectTypeKey);
              }

              const projectImage = project.isSubdomain
                ? subdomainProject?.coverImage || subdomainProject?.logo
                : (project as ProjectItem).image;

              const projectLink =
                !project.isSubdomain && "link" in project
                  ? (project as ProjectItem).link
                  : null;

              return (
                <div
                  key={project.id || index}
                  className="group relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-500 hover:scale-[1.03] shadow-lg dark:shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 animate-fade-in min-h-[420px]"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden pointer-events-none">
                    {projectImage ? (
                      <Image
                        src={projectImage}
                        alt={project.title || "Project"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-orange-500/20 flex items-center justify-center">
                        <div className="text-6xl opacity-50">🚀</div>
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                    {/* Category Badge - Admin panelden seçilen kategori */}
                    {project.isSubdomain && subdomainProject?.category && (
                      <div className="absolute top-4 right-4 z-10 pointer-events-none">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${badge.color} text-white shadow-lg backdrop-blur-sm border border-white/20`}
                        >
                          {getCategoryLabel(subdomainProject.category)}
                        </span>
                      </div>
                    )}

                    {/* Type Badge - Standart projeler için */}
                    {!project.isSubdomain && (
                      <div className="absolute top-4 right-4 z-10 pointer-events-none">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${badge.color} text-white shadow-lg backdrop-blur-sm border border-white/20`}
                        >
                          {badge.text}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4 relative z-10 flex flex-col justify-between h-[calc(100%-16rem)]">
                    <div>
                      <h3 className="text-slate-900 dark:text-slate-50 text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>

                      {subdomainProject?.tagline && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 italic">
                          {subdomainProject.tagline}
                        </p>
                      )}

                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack (subdomain projelerde) */}
                    {subdomainProject?.techStack &&
                      subdomainProject.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {subdomainProject.techStack
                            .slice(0, 3)
                            .map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70"
                              >
                                {tech}
                              </span>
                            ))}
                          {subdomainProject.techStack.length > 3 && (
                            <span className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70">
                              +{subdomainProject.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                    {/* Action Button */}
                    <div className="mt-4">
                      {subdomainProject ? (
                        <button
                          type="button"
                          onClick={(e) => handleProjectClick(project, e)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="w-full px-6 py-3 rounded-xl font-semibold text-sm bg-white/80 dark:bg-transparent backdrop-blur-sm border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Keşfet</span>
                          <span className="text-lg">→</span>
                        </button>
                      ) : projectLink ? (
                        <a
                          href={projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="block w-full px-6 py-3 rounded-xl font-semibold text-sm bg-white/80 dark:bg-transparent backdrop-blur-sm border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Ziyaret Et</span>
                          <span className="text-lg">↗</span>
                        </a>
                      ) : (
                        <div className="w-full px-6 py-3 rounded-xl font-semibold text-sm bg-slate-200 dark:bg-gray-500/50 text-slate-500 dark:text-white/50 flex items-center justify-center gap-2">
                          <span>Link Yok</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ zIndex: 0 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-orange-500/10" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      {(data.items.length > 0 || subdomainProjects.length > 0) && (
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          <div className="text-center p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-xl">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {allProjects.length}
            </div>
            <div className="text-slate-600 dark:text-white/60 text-sm">Toplam Proje</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-xl">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {data.items.length}
            </div>
            <div className="text-slate-600 dark:text-white/60 text-sm">Standart Proje</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-xl">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {subdomainProjects.length}
            </div>
            <div className="text-slate-600 dark:text-white/60 text-sm">Subdomain</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-xl">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {
                new Set(
                  allProjects.map((p) =>
                    "type" in p && p.type ? p.type : "web"
                  )
                ).size
              }
            </div>
            <div className="text-slate-600 dark:text-white/60 text-sm">Kategori</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;

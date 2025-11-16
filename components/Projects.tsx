"use client";

import Image from "next/image";
import Link from "next/link";
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
    case "web":
    default:
      return { text: "Web Projesi", color: "from-indigo-500 to-purple-500" };
  }
}

const Projects: React.FC = () => {
  const [data, setData] = useState<ProjectsData | null>(null);
  const [subdomainProjects, setSubdomainProjects] = useState<SubdomainProject[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load regular projects
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

        // Load subdomain projects from API
        try {
          const contentRes = await fetch("/api/content/subdomainProjects");
          if (contentRes.ok) {
            const subdomainProjs = await contentRes.json();
            // Filter only published projects
            const published = Array.isArray(subdomainProjs) 
              ? subdomainProjs.filter((p: SubdomainProject) => p.published !== false)
              : [];
            setSubdomainProjects(published);
          } else {
            setSubdomainProjects([]);
          }
        } catch (err) {
          console.error("Error loading subdomain projects:", err);
          setSubdomainProjects([]);
        }
      } catch {
        setData(fallbackProjects);
        setSubdomainProjects([]);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Yükleniyor...
      </div>
    );
  }

  // Combine all projects
  const allProjects = [
    ...data.items.map((item) => ({ ...item, isSubdomain: false })),
    ...subdomainProjects.map((item) => ({ ...item, isSubdomain: true })),
  ];

  // Filter projects
  const filteredProjects = allProjects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "regular") return !project.isSubdomain;
    if (activeFilter === "subdomain") return project.isSubdomain;
    return project.type === activeFilter;
  });

  const filters = [
    { id: "all", label: "Tümü" },
    { id: "regular", label: "Standart Projeler" },
    { id: "subdomain", label: "Subdomain Projeleri" },
    { id: "mobile-app", label: "Mobil Uygulamalar" },
    { id: "saas", label: "SaaS" },
    { id: "web", label: "Web" },
    { id: "game", label: "Oyunlar" },
    { id: "ecommerce", label: "E-Ticaret" },
  ];

  const handleProjectClick = (project: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (project.isSubdomain) {
      // Navigate to subdomain page
      const subdomain = (project as SubdomainProject).subdomain;
      if (subdomain) {
        window.location.href = `/subdomain/${subdomain}`;
      }
    } else if ((project as ProjectItem).link) {
      // Open external link
      window.open((project as ProjectItem).link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="px-4 py-20 min-h-screen relative"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {/* Header */}
      <div className="text-center mb-16 animate-zoom-in" style={{ position: 'relative', zIndex: 10 }}>
        <h2 className="text-white font-semibold text-4xl md:text-5xl lg:text-7xl mb-4">
          {data.title}
        </h2>
        <p className="tracking-[0.5em] text-transparent font-light bg-clip-text bg-gradient-to-r from-purple-700 to-orange-500 text-sm md:text-lg lg:text-xl">
          {data.subtitle}
        </p>
      </div>

      {/* Filters */}
      <div 
        className="flex flex-wrap justify-center gap-3 mb-12 px-4 animate-fade-in relative" 
        style={{ 
          animationDelay: "0.2s", 
          animationFillMode: "both",
          zIndex: 1000,
          position: 'relative'
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Filter clicked:", filter.id);
              setActiveFilter(filter.id);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              activeFilter === filter.id
                ? "bg-white text-black shadow-lg shadow-white/30 scale-105"
                : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105"
            }`}
            style={{
              position: 'relative',
              zIndex: 1000,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto max-w-7xl" style={{ position: 'relative', zIndex: 1 }}>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">Bu kategoride proje bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              const badge = getTypeBadge(project.type || "web");
              const projectImage = project.isSubdomain 
                ? (project as SubdomainProject).coverImage || (project as SubdomainProject).logo 
                : (project as ProjectItem).image;

              const subdomainProject = project.isSubdomain ? (project as SubdomainProject) : null;
              const projectLink = !project.isSubdomain ? (project as ProjectItem).link : null;

              return (
                <div
                  key={project.id || index}
                  className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
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
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10 pointer-events-none">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${badge.color} text-white shadow-lg backdrop-blur-sm border border-white/20`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* Subdomain Badge */}
                    {project.isSubdomain && (
                      <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg backdrop-blur-sm border border-white/20">
                          🌐 Subdomain
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4 relative z-10">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      {project.tagline && (
                        <p className="text-white/70 text-sm mb-3 italic">
                          {(project as SubdomainProject).tagline}
                        </p>
                      )}
                      <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">
                        {project.description || (project as SubdomainProject).description}
                      </p>
                    </div>

                    {/* Tech Stack (for subdomain projects) */}
                    {project.isSubdomain && (project as SubdomainProject).techStack && (project as SubdomainProject).techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {(project as SubdomainProject).techStack.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/70"
                          >
                            {tech}
                          </span>
                        ))}
                        {(project as SubdomainProject).techStack.length > 3 && (
                          <span className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/70">
                            +{(project as SubdomainProject).techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-4" style={{ position: 'relative', zIndex: 9999 }}>
                      {subdomainProject ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const subdomain = subdomainProject?.subdomain;
                            console.log("=== BUTTON CLICKED ===");
                            console.log("Subdomain:", subdomain);
                            console.log("Full project:", subdomainProject);
                            if (subdomain) {
                              const baseUrl = window.location.origin;
                              const url = `${baseUrl}/subdomain/${subdomain}`;
                              console.log("Redirecting to:", url);
                              setTimeout(() => {
                                window.location.href = url;
                              }, 100);
                            } else {
                              console.error("Subdomain is missing!");
                              alert(`Subdomain bulunamadı! Project: ${JSON.stringify(subdomainProject)}`);
                            }
                            return false;
                          }}
                          onMouseDown={(e) => {
                            console.log("Mouse down on button");
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onMouseUp={(e) => {
                            console.log("Mouse up on button");
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="w-full px-6 py-3 rounded-xl font-semibold text-sm bg-transparent backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                          style={{ 
                            position: 'relative', 
                            zIndex: 9999, 
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                          }}
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
                            console.log("External link clicked:", projectLink);
                            e.stopPropagation();
                          }}
                          className="block w-full px-6 py-3 rounded-xl font-semibold text-sm bg-transparent backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                          style={{ 
                            position: 'relative', 
                            zIndex: 9999, 
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                          }}
                        >
                          <span>Ziyaret Et</span>
                          <span className="text-lg">↗</span>
                        </a>
                      ) : (
                        <div className="w-full px-6 py-3 rounded-xl font-semibold text-sm bg-gray-500/50 text-white/50 flex items-center justify-center gap-2">
                          <span>Link Yok</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ zIndex: 0 }}>
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
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">{allProjects.length}</div>
            <div className="text-white/60 text-sm">Toplam Proje</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">{data.items.length}</div>
            <div className="text-white/60 text-sm">Standart Proje</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">{subdomainProjects.length}</div>
            <div className="text-white/60 text-sm">Subdomain</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">
              {new Set(allProjects.map((p) => p.type)).size}
            </div>
            <div className="text-white/60 text-sm">Kategori</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;

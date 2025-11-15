"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import type { ProjectsData, ProjectItem } from "@/lib/data";

const fallbackProjects: ProjectsData = {
  title: "PROJECTS",
  subtitle: "EXPLORE NOW",
  items: [
    {
      id: "1",
      title: "WebHR",
      description:
        "Next.js kullanarak 50'den fazla ekrandan oluşan modern bir UI web sitesi tasarladım, ayrıca bir blog entegrasyonu yaptım.",
      image: "/FirstProject.png",
      link: "https://web.hr/",
      type: "saas",
    },
    {
      id: "2",
      title: "HireSides",
      description:
        "Kullanıcıların iş başvurusu yapmasına, iş ilanları oluşturmasına ve şirket profillerini yönetmesine olanak tanıyan Next.js üzerinde bir web uygulaması geliştirdim.",
      image: "/SecondProject.png",
      link: "https://hireside.com/",
      type: "web",
    },
    {
      id: "3",
      title: "Verge Systems",
      description: "React.js kullanarak Verge Systems web sitesini geliştirdim.",
      image: "/ThirdProject.png",
      link: "https://www.vergesystems.com/",
      type: "web",
    },
    {
      id: "4",
      title: "Payoasis",
      description:
        "Gatsby kullanarak bir bankacılık web sitesi için modern UI tasarladım.",
      image: "/FourProject.png",
      link: "http://44.201.47.75/",
      type: "ecommerce",
    },
  ],
};

function getTypeBadge(project: ProjectItem) {
  switch (project.type) {
    case "mobile-app-template":
      return "Mobil Uygulama Şablonu";
    case "ecommerce":
      return "E-Ticaret Projesi";
    case "game":
      return "Oyun / Game";
    case "saas":
      return "SaaS / Yazılım";
    case "web":
    default:
      return "Web Projesi";
  }
}

const Projects: React.FC = () => {
  const [data, setData] = useState<ProjectsData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/content/projects");
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const json: ProjectsData = await res.json();
        // basic guard
        if (!json || !Array.isArray(json.items)) {
          setData(fallbackProjects);
        } else {
          setData(json);
        }
      } catch {
        setData(fallbackProjects);
      }
    };

    loadProjects();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Yükleniyor...
      </div>
    );
  }

  return (
    <section ref={sectionRef} id="projects" className="px-4">
      <h2 className="text-white font-semibold text-center text-4xl md:text-5xl lg:text-6xl pt-[35px] animate-zoom-in">
        {data.title}
      </h2>
      <p
        className="tracking-[0.5em] text-center text-transparent font-light pb-5 bg-clip-text bg-gradient-to-r from-purple-700 to-orange-500 text-sm md:text-lg lg:text-xl animate-fade-in"
        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
      >
        {data.subtitle}
      </p>

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
          {data.items.map((project) => (
            <div
              key={project.id}
              className="project-card-wrapper relative mb-5 group"
            >
              {/* Project Card */}
              <div className="project-card flex flex-col sm:flex-row bg-[#1a1a1a] rounded-lg border border-[#2E2E2E] p-4 transition-all duration-300 hover:border-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in">
                <Image
                  src={project.image}
                  height={150}
                  width={150}
                  alt={project.title}
                  className="w-full sm:w-[120px] md:w-[150px] h-[150px] sm:h-[120px] md:h-[150px] object-cover rounded mb-3 sm:mb-0"
                />
                <div className="p-3 flex-1">
                  <p className="text-white font-semibold text-lg md:text-xl mb-2">
                    {project.title}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm">
                    {project.description}
                  </p>
                  <span className="inline-block mt-3 text-[10px] md:text-xs bg-purple-600/80 text-white px-3 py-1 rounded-full uppercase tracking-[0.18em]">
                    {getTypeBadge(project)}
                  </span>
                  {project.privacyPolicy && (
                    <p className="mt-2 text-[10px] text-gray-400 line-clamp-2">
                      Privacy: {project.privacyPolicy}
                    </p>
                  )}
                </div>
              </div>

              {/* Hover Overlay with Blur and Access Text */}
              <div className="project-overlay absolute inset-0 bg-black/95 backdrop-blur-xl rounded-lg flex flex-col items-center justify-center opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-[9999] p-4 sm:p-6 border-2 border-purple-500 shadow-2xl">
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-center">
                  {project.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm max-w-sm text-center mb-5">
                  {project.description}
                </p>
                <Link
                  href={project.link}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="px-8 py-3 rounded-xl font-semibold text-base sm:text-lg bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30 transition-all duration-200"
                >
                  Access
                </Link>
              </div>

              {/* Blur effect */}
              <style jsx>{`
                .project-card-wrapper:hover .project-card {
                  filter: blur(8px);
                  opacity: 0.6;
                }
              `}</style>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

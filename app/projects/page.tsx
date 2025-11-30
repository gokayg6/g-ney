"use client";

import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useEffect, useState } from "react";
import { ProjectsData } from "@/lib/data";

export default function ProjectsPage() {
  const [meta] = useState<{ title: string; subtitle: string }>({
    title: "PROJELER",
    subtitle: "KEŞFET",
  });

  useEffect(() => {
    // Fetch in background without blocking render
    fetch("/api/content/projects")
      .then((res) => res.json())
      .then((data: ProjectsData) => {
        if (data.title || data.subtitle) {
          // Optionally update if needed, but don't block initial render
        }
      })
      .catch(() => {
        // Silent fail
      });
  }, []);

  return (
    <main className="h-full w-full bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center min-h-screen relative z-10">
      <div className="flex flex-col pt-16 md:pt-20 pb-8">
        <PageHero
          title={meta.title}
          subtitle={meta.subtitle}
          showLogo={false}
        />
        <Projects showHeader={false} />
        <Footer />
      </div>
    </main>
  );
}



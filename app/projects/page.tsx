"use client";

import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useEffect, useState } from "react";
import type { ProjectsData } from "@/lib/data";

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectsData | null>(null);

  useEffect(() => {
    fetch("/api/content/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.title) {
          setData(data);
        } else {
          setData({
            title: "PROJECTS",
            subtitle: "EXPLORE NOW",
            items: [],
          });
        }
      })
      .catch(() => {
        setData({
          title: "PROJECTS",
          subtitle: "EXPLORE NOW",
          items: [],
        });
      });
  }, []);

  return (
    <main className="h-full w-full bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center min-h-screen">
      {data && (
        <PageHero
          title={data.title}
          subtitle={data.subtitle}
          showLogo={true}
        />
      )}
      <div className="flex flex-col gap-20 pb-8">
        <Projects />
        <Footer />
      </div>
    </main>
  );
}



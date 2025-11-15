/**
 * /subdomain/[subdomain] ana sayfası
 * Örnek: /subdomain/app, /subdomain/shop, /subdomain/testgame, /subdomain/falla
 */

import BiorhythmTemplate from "@/components/templates/BiorhythmTemplate";
import ShadowQuestTemplate from "@/components/templates/ShadowQuestTemplate";
import LuxeStyleTemplate from "@/components/templates/LuxeStyleTemplate";
import FallaTemplate from "@/components/templates/FallaTemplate";
import {
  getAllSubdomainProjects,
  getProjectBySubdomain,
} from "@/lib/subdomain-data";

interface SubdomainPageProps {
  params: {
    subdomain: string;
  };
}

export default function SubdomainPage({ params }: SubdomainPageProps) {
  const rawSubdomain = params.subdomain;
  const sub = rawSubdomain?.toLowerCase();

  const project = getProjectBySubdomain(sub);

  // Proje bulunamadıysa: debug ekranı
  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <p className="text-xs md:text-sm text-white/60 tracking-[0.25em] uppercase">
            Subdomain not mapped
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            “{rawSubdomain}” için proje bulunamadı.
          </h1>
          <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">
            <code>lib/data.json</code> içindeki{" "}
            <code>subdomainProjects</code> dizisinde
            <br />
            <code>"subdomain": "{rawSubdomain}"</code> olan bir kayıt
            olduğundan emin ol.
          </p>
        </div>
      </main>
    );
  }

  // Subdomain → Template eşleştirmesi
  switch (sub) {
    case "app":
      return <BiorhythmTemplate project={project} />;

    case "testgame":
      return <ShadowQuestTemplate project={project} />;

    case "shop":
      return <LuxeStyleTemplate project={project} />;

    case "falla":
      return <FallaTemplate project={project} />;

    default:
      // Proje var ama template case'i eklenmemiş
      return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-4 px-6">
            <p className="text-xs md:text-sm text-white/60 tracking-[0.25em] uppercase">
              Template missing
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold">
              “{project.name}” için template tanımlı değil.
            </h1>
            <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">
              <code>app/subdomain/[subdomain]/page.tsx</code> içindeki{" "}
              <code>switch</code> bloğuna{" "}
              <code>case "{sub}":</code> eklemen gerekiyor.
            </p>
          </div>
        </main>
      );
  }
}

/**
 * Static params:
 * build sırasında /subdomain/app, /subdomain/shop vb. rotaları üretmek için.
 */
export async function generateStaticParams() {
  const projects = getAllSubdomainProjects();

  return projects.map((project) => ({
    subdomain: project.subdomain,
  }));
}

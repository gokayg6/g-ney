/**
 * /subdomain/[subdomain] ana sayfası
 * Örnek: /subdomain/app, /subdomain/shop, /subdomain/testgame, /subdomain/falla
 */

import BiorhythmTemplate from "@/components/templates/BiorhythmTemplate";
import ShadowQuestTemplate from "@/components/templates/ShadowQuestTemplate";
import LuxeStyleTemplate from "@/components/templates/LuxeStyleTemplate";
import FallaTemplate from "@/components/templates/FallaTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
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
            <code>
              &quot;subdomain&quot;: &quot;{rawSubdomain}&quot;
            </code>{" "}
            olan bir kayıt olduğundan emin ol.
          </p>
        </div>
      </main>
    );
  }

  // Template seçimi category'ye göre yapılır
  // Her kategori için doğru template kullanılır
  switch (project.category) {
    case 'mobile-app':
      return <BiorhythmTemplate project={project} />;
    
    case 'game':
      return <ShadowQuestTemplate project={project} />;
    
    case 'ecommerce':
      return <LuxeStyleTemplate project={project} />;
    
    case 'saas':
      return <ClassicTemplate project={project} />;
    
    case 'social':
      return <FallaTemplate project={project} />;
    
    default:
      // Fallback: Eğer category yoksa veya tanımlı değilse, subdomain'e göre seç
      // Bu eski projeler için geriye dönük uyumluluk sağlar
      switch (sub) {
        case "app":
          return <BiorhythmTemplate project={project} />;
        case "testgame":
          return <ShadowQuestTemplate project={project} />;
        case "shop":
        case "luxestyle":
          return <LuxeStyleTemplate project={project} />;
        case "falla":
          return <FallaTemplate project={project} />;
        default:
          return <ClassicTemplate project={project} />;
      }
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

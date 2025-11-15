import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export default function ProjectsPage() {
  return (
    <main className="h-full w-full bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center min-h-screen">
      <div className="flex flex-col gap-20 pt-20 pb-8 animate-zoom-in">
        <Projects />
        <Footer />
      </div>
    </main>
  );
}



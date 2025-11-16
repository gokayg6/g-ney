import About from "@/components/About";
import Banner from "@/components/Banner";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="h-full w-full bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center">
      <div className="flex flex-col gap-20 pb-8 animate-zoom-in">
        <Banner />
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}


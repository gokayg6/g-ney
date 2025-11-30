import About from "@/components/About";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="h-full w-full relative z-10 min-h-screen">
      <div className="flex flex-col pt-20 pb-8">
        <About />
        <Footer />
      </div>
    </main>
  );
}



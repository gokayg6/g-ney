import About from "@/components/About";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="h-full w-full bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center min-h-screen">
      <div className="flex flex-col pt-20 pb-8">
        <About />
        <Footer />
      </div>
    </main>
  );
}



import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="h-full w-full bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center min-h-screen">
      <div className="flex flex-col pt-20 pb-8">
        <Contact />
        <Footer />
      </div>
    </main>
  );
}



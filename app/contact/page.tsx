"use client";

import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    // Sayfa yüklendiğinde instant scroll
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main className="h-full w-full relative z-10 min-h-screen">
      <div className="flex flex-col pt-20 pb-8">
        <Contact />
        <Footer />
      </div>
    </main>
  );
}



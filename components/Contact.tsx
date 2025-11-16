"use client";

import React, { useEffect, useState, useRef } from "react";
import { ContactData } from "@/lib/data";

const Contact: React.FC<{}> = () => {
  const [data, setData] = useState<ContactData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/content/contact")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => {
        // Fallback data
        setData({
          title: "CONTACT",
          subtitle: "GET IN TOUCH",
          email: "mustafakarakus@gmail.com",
          phone: "+90 555 123 45 67",
          description: "İşbirlikleri, fırsatlar veya sadece merhaba demek için çekinmeden iletişime geçin!",
        });
      });

  }, []);

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</div>;
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden px-4 py-20"
    >
      <div className="flex flex-col justify-center items-center max-w-[900px] w-full gap-6">
        <h1 className="text-white font-semibold text-4xl md:text-5xl lg:text-6xl text-center animate-zoom-in">
          {data.title}
        </h1>
        <p className="tracking-[0.5em] text-transparent font-light bg-clip-text bg-gradient-to-r from-purple-700 to-orange-500 text-sm md:text-lg lg:text-xl text-center animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {data.subtitle}
        </p>
        <p className="text-gray-300 text-center text-base md:text-lg lg:text-xl max-w-3xl">
          {data.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
          <a
            href={`mailto:${data.email}`}
            className="z-[1] hover:bg-white rounded-3xl text-white font-semibold hover:text-black py-3 px-8 border border-white hover:border-transparent transition-all duration-150 active:scale-95 inline-block animate-slide-up flex items-center gap-2"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <span>📧</span>
            <span>{data.email}</span>
          </a>
          {data.phone && (
            <a
              href={`tel:${data.phone.replace(/\s/g, '')}`}
              className="z-[1] hover:bg-white rounded-3xl text-white font-semibold hover:text-black py-3 px-8 border border-white hover:border-transparent transition-all duration-150 active:scale-95 inline-block animate-slide-up flex items-center gap-2"
              style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
              <span>📞</span>
              <span>{data.phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;



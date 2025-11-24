"use client";

import React, { useEffect, useState, useRef } from "react";
import { ContactData } from "@/lib/data";
import PageHero from "./PageHero";
import { motion } from "framer-motion";

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
      className="relative overflow-hidden"
    >
      <PageHero
        title={data.title}
        subtitle={data.subtitle}
        description={data.description}
        showLogo={true}
      />
      
      {/* Contact Butonları */}
      <div className="flex flex-col items-center justify-center px-4 pb-20 -mt-20 relative z-10">
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <a
            href={`mailto:${data.email}`}
            className="relative overflow-hidden group
                     bg-slate-50 dark:bg-white/10 backdrop-blur-xl
                     border-2 border-slate-300 dark:border-white/20
                     text-slate-900 dark:text-white font-semibold py-4 px-8 
                     rounded-2xl
                     shadow-xl dark:shadow-lg hover:shadow-2xl hover:border-slate-400 dark:hover:border-white/30
                     transition-all duration-300
                     cursor-pointer
                     select-none
                     active:scale-[0.98]
                     flex items-center gap-2"
            style={{
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100/0 dark:from-white/0 via-slate-200/30 dark:via-white/10 to-slate-100/0 dark:to-white/0 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="relative z-10">📧</span>
            <span className="relative z-10">{data.email}</span>
          </a>
          {data.phone && (
            <a
              href={`tel:${data.phone.replace(/\s/g, '')}`}
              className="relative overflow-hidden group
                       bg-white dark:bg-white/5 backdrop-blur-xl
                       border-2 border-slate-300 dark:border-white/15
                       text-slate-900 dark:text-white font-semibold py-4 px-8 
                       rounded-2xl
                       shadow-xl dark:shadow-lg hover:shadow-2xl hover:border-slate-400 dark:hover:border-white/25
                       transition-all duration-300
                       cursor-pointer
                       select-none
                       active:scale-[0.98]
                       flex items-center gap-2"
              style={{
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50/0 dark:from-white/0 via-slate-100/20 dark:via-white/10 to-slate-50/0 dark:to-white/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <span className="relative z-10">📞</span>
              <span className="relative z-10">{data.phone}</span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;



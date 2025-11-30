"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TestimonialsData } from "@/lib/data";
import { FaStar } from "react-icons/fa";

export default function Testimonials() {
  const [data, setData] = useState<TestimonialsData | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetch("/api/content/testimonials")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <section id="testimonials" className="relative w-full flex flex-col items-center justify-center px-4 md:px-8 py-16">
      <div ref={ref} className="max-w-7xl w-full">
        {/* Başlık Box - Premium Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="group relative backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 rounded-3xl p-8 md:p-10 lg:p-12 border border-white/20 hover:border-white/40 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/8 hover:to-white/8 transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4"
            >
              {data.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-gray-300 font-light tracking-wide group-hover:text-gray-200 transition-colors duration-500"
            >
              {data.subtitle}
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((testimonial, index) => {
            const avatarUrl = testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=6366f1&color=fff&size=128`;
            
            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="group backdrop-blur-xl bg-white/5 rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-colors">
                    <Image
                      src={avatarUrl}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {testimonial.position} @ {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < testimonial.rating ? "text-yellow-400" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-200 leading-relaxed mb-3 text-sm">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <p className="text-gray-500 text-xs">{testimonial.date}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

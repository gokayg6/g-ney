"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ServicesData } from "@/lib/data";
import { 
  FaMobileAlt, 
  FaGlobe, 
  FaPalette, 
  FaServer 
} from "react-icons/fa";

const iconMap: { [key: string]: any } = {
  "📱": FaMobileAlt,
  "🌐": FaGlobe,
  "🎨": FaPalette,
  "⚙️": FaServer,
};

export default function Services() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetch("/api/content/services")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <section id="services" className="relative w-full flex flex-col items-center justify-center px-4 md:px-8 py-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((service, index) => {
            const IconComponent = iconMap[service.icon] || null;
            
            return (
              <motion.div
                key={service.id}
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
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {IconComponent ? (
                    <IconComponent className="text-white" />
                  ) : (
                    <span>{service.icon}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">
                  {service.description}
                </p>
                {service.price && (
                  <p className="text-purple-400 font-semibold mb-4 text-sm">
                    {service.price}
                  </p>
                )}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-300 text-xs flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

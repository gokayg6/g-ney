"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { StatisticsData } from "@/lib/data";
import { 
  FaRocket, 
  FaSmile, 
  FaStar, 
  FaCode 
} from "react-icons/fa";

const iconMap: { [key: string]: any } = {
  "🚀": FaRocket,
  "😊": FaSmile,
  "⭐": FaStar,
  "💻": FaCode,
};

export default function Statistics() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetch("/api/content/statistics")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <section className="relative w-full flex flex-col items-center justify-center px-4 md:px-8 py-16">
      <div ref={ref} className="max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            {data.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300"
          >
            {data.subtitle}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.items.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || null;
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -15 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1, rotateY: 0 } : {}}
                whileHover={{ scale: 1.1, y: -5, rotateY: 5 }}
                transition={{ 
                  duration: 0.7,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="group backdrop-blur-xl bg-white/5 rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] text-center"
              >
                <div className="text-4xl mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {IconComponent ? (
                    <IconComponent className="text-white" />
                  ) : (
                    <span>{stat.icon}</span>
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {stat.value}
                  {stat.suffix}
                </motion.div>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

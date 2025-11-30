"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SkillsData } from "@/lib/data";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiJavascript,
  SiNodedotjs,
  SiFirebase,
  SiGit,
  SiFigma,
  SiAws
} from "react-icons/si";

const iconMap: { [key: string]: any } = {
  "React Native": SiReact,
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Node.js": SiNodedotjs,
  "Firebase": SiFirebase,
  "Git": SiGit,
  "Figma": SiFigma,
  "AWS": SiAws,
};

export default function Skills() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetch("/api/content/skills")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  if (!data || !data.items || data.items.length === 0) return null;

  const categories = ["frontend", "backend", "mobile", "tools", "other"] as const;
  const categoryLabels: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    mobile: "Mobile",
    tools: "Tools",
    other: "Other",
  };

  // Sort skills by level (highest first)
  const sortedSkills = [...data.items].sort((a, b) => b.level - a.level);

  return (
    <section id="skills" className="relative w-full flex flex-col items-center justify-center px-4 md:px-8 py-16">
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

        {categories.map((category) => {
          const categorySkills = sortedSkills.filter((skill) => skill.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ 
                duration: 0.6,
                delay: categories.indexOf(category) * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="mb-6"
            >
              {/* Kategori Box - Glassmorphism */}
              <div className="group backdrop-blur-xl bg-white/5 rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                <h3 className="text-xl font-bold text-white mb-6">
                  {categoryLabels[category]}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categorySkills.map((skill, index) => {
                    const IconComponent = iconMap[skill.name] || null;
                    
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                        whileHover={{ scale: 1.1, y: -5 }}
                        transition={{ 
                          duration: 0.5,
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }}
                        className="group backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] text-center"
                      >
                        <div className="text-3xl mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                          {IconComponent ? (
                            <IconComponent className="text-white" />
                          ) : (
                            <span>{skill.icon}</span>
                          )}
                        </div>
                        <h4 className="text-white font-semibold mb-2 text-sm">{skill.name}</h4>
                        <div className="w-full bg-white/10 rounded-full h-1.5 mb-1 backdrop-blur-sm border border-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${skill.level}%` } : {}}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-white/40 via-white/60 to-white/80 h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          />
                        </div>
                        <p className="text-gray-400 text-xs">{skill.level}%</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

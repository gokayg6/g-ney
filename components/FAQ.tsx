"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FAQData } from "@/lib/data";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FAQ() {
  const [data, setData] = useState<FAQData | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetch("/api/content/faq")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  const toggleItem = (id: string) => {
    const newSet = new Set(openItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setOpenItems(newSet);
  };

  if (!data || !data.items || data.items.length === 0) return null;

  const categories = Array.from(new Set(data.items.map((item) => item.category)));

  return (
    <section id="faq" className="relative w-full flex flex-col items-center justify-center px-4 md:px-8 py-16">
      <div ref={ref} className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {data.title}
          </h2>
          <p className="text-lg text-gray-300">{data.subtitle}</p>
        </motion.div>

        <div className="space-y-4">
          {categories.map((category, catIndex) => {
            const categoryItems = data.items.filter((item) => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: catIndex * 0.1 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 capitalize">
                  {category}
                </h3>
                {categoryItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: (catIndex * 0.1) + (index * 0.05) }}
                    className="group backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 mb-4 overflow-hidden hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      style={{ pointerEvents: 'auto', zIndex: 10, position: 'relative' }}
                      className="w-full p-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span className="text-white font-semibold text-base pr-4">
                        {item.question}
                      </span>
                      <span className="text-white flex-shrink-0">
                        {openItems.has(item.id) ? (
                          <FaChevronUp className="group-hover:scale-110 transition-transform" />
                        ) : (
                          <FaChevronDown className="group-hover:scale-110 transition-transform" />
                        )}
                      </span>
                    </button>
                    {openItems.has(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-gray-300 leading-relaxed text-sm">{item.answer}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

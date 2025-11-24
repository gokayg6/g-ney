"use client";

import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Hydration hatası önlemek için
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[60px] h-[30px] rounded-full bg-slate-200 dark:bg-[#1c1c1e]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-3">
      {/* Tema durumu metni */}
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden sm:block">
        {isDark ? "Karanlık Mod" : "Açık Mod"}
      </span>

      {/* iOS Switch Toggle */}
      <button
        onClick={toggleTheme}
        className={`
          relative w-[60px] h-[30px] rounded-full
          transition-colors duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isDark 
            ? "bg-[#1c1c1e] focus:ring-slate-500" 
            : "bg-[#e5e5ea] focus:ring-slate-300"
          }
        `}
        aria-label={isDark ? "Light mode'a geç" : "Dark mode'a geç"}
      >
        {/* Track içindeki icon'lar */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {/* Güneş iconu - Light modda görünür */}
          <motion.span
            className="text-sm"
            initial={false}
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0.8 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            ☀️
          </motion.span>

          {/* Ay iconu - Dark modda görünür */}
          <motion.span
            className="text-sm"
            initial={false}
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            🌙
          </motion.span>
        </div>

        {/* Thumb - Kayan daire */}
        <motion.div
          className={`
            absolute top-[3px] w-[24px] h-[24px] rounded-full
            shadow-lg
            flex items-center justify-center
            ${isDark 
              ? "bg-white" 
              : "bg-white"
            }
          `}
          initial={false}
          animate={{
            x: isDark ? 33 : 3,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Thumb içindeki küçük icon */}
          <motion.span
            className="text-[10px]"
            initial={false}
            animate={{
              opacity: 1,
            }}
          >
            {isDark ? "🌙" : "☀️"}
          </motion.span>
        </motion.div>
      </button>
    </div>
  );
};

export default ThemeToggle;


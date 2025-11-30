"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Instant scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ 
          opacity: 0,
          scale: 1.08,
          filter: "blur(12px)"
        }}
        animate={{ 
          opacity: 1,
          scale: 1,
          filter: "blur(0px)"
        }}
        transition={{
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1], // iOS-style easing
        }}
        style={{
          minHeight: '100vh',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 1,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

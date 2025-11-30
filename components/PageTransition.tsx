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
          scale: 1.02, 
          filter: "blur(4px)" 
        }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          filter: "blur(0px)" 
        }}
        exit={{ 
          opacity: 0,
          scale: 0.98,
          filter: "blur(4px)",
          transition: { duration: 0.15 }
        }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1], // iOS easing
        }}
        style={{
          minHeight: '100vh',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'transparent',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

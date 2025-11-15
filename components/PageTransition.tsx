"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (pathname !== prevPathnameRef.current) {
      // Start exit animation (blur and scale down)
      setIsTransitioning(true);
      
      // After exit animation completes, allow new page to render
      timeoutRef.current = setTimeout(() => {
        prevPathnameRef.current = pathname;
        
        // Small delay then remove transition class for enter animation
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    } else {
      // Same pathname, no transition needed
      setIsTransitioning(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  return (
    <div 
      className={isTransitioning ? 'transitioning' : ''}
      style={{
        willChange: isTransitioning ? 'transform, filter, opacity' : 'auto',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        opacity: isTransitioning ? 0.8 : 1,
      }}
    >
      {children}
    </div>
  );
}


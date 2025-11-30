import React from 'react';
import DarkVeil from '@/components/DarkVeil';
import Threads from '@/components/Threads';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* DarkVeil - Mor arka plan (en altta) */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -2, pointerEvents: 'none' }}>
        <DarkVeil />
      </div>
      {/* Threads - Mor arka planın üstünde ama içeriklerin altında */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1, pointerEvents: 'none' }}>
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
          color={[1, 1, 1]}
        />
      </div>
      <div className="relative z-[100]" style={{ position: 'relative', zIndex: 100 }}>
        {children}
      </div>
    </>
  );
}


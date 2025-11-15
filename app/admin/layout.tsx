import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-[100]" style={{ position: 'relative', zIndex: 100 }}>
      {children}
    </div>
  );
}


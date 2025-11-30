/**
 * Subdomain Layout
 * Bu layout sadece /subdomain/* rotaları için geçerli.
 */

import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import StarsCanvas from "@/components/main/StarsBackground";

const inter = Inter({ subsets: ["latin"] });

interface SubdomainLayoutProps {
  children: ReactNode;
}

export default function SubdomainLayout({ children }: SubdomainLayoutProps) {
  return (
    <div
      className={`${inter.className} bg-[#0a0a0a] min-h-screen overflow-y-scroll overflow-x-hidden relative`}
    >
      <StarsCanvas />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

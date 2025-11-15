/**
 * Subdomain Layout
 * Bu layout sadece /subdomain/* rotaları için geçerli.
 */

import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

interface SubdomainLayoutProps {
  children: ReactNode;
}

export default function SubdomainLayout({ children }: SubdomainLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#0a0a0a] overflow-y-scroll overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

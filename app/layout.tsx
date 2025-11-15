import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StarsCanvas from "@/components/main/StarsBackground";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ibiimemon.com/"),
  title: "Loegs Portfolyo",
  description:
    "3+ yıl deneyime sahip Frontend & Mobil Uygulama Geliştiricisi Portfolyosu. Kıdemli Yazılım Mühendisi. Mobil uygulamalar, UX ve JavaScript teknolojilerinde uzmanlaşmış.",
  keywords: [
    "Developer",
    "Portfolio",
    "Developer Portflio",
    "Loegs",
    "Ibrahim",
    "IbiiMemon",
    "IbrahimMemon",
    "Ibrahim_Memon",
    "Next.js",
    "ReactNative",
    "Android",
  ],
  icons: {
    icon: "/loegs.png",
    shortcut: "/loegs.png",
    apple: "/loegs.png",
  },
  openGraph: {
    title: "Loegs Portfolyo",
    description:
      "3+ yıl deneyime sahip Frontend & Mobil Uygulama Geliştiricisi. Kıdemli Yazılım Mühendisi. Mobil uygulamalar, UX ve JavaScript teknolojilerinde uzmanlaşmış.",
    images: "/OpenGraph.jpg",
  },
  alternates: {
    canonical: "",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/loegs.png" type="image/png" />
        <link rel="shortcut icon" href="/loegs.png" type="image/png" />
        <link rel="apple-touch-icon" href="/loegs.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5956124359067452"
          crossOrigin="anonymous"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "Person",
              name: "Loegs.com",
              jobTitle: "Yazılım Mühendisi",
              url: "mustafakarakus.com",
              sameAs: [
                "https://www.linkedin.com/in/mustafakarakus/",
                "https://github.com/mustafakarakus",
              ],
            }),
          }}
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.NEXT_PRIVATE_GTID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-${process.env.NEXT_PRIVATE_GTID}');
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-[#111] overflow-y-scroll overflow-x-hidden`}
      >
        <SpeedInsights />
        <Analytics />
        <StarsCanvas />
        <Navbar />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}

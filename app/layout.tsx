import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StarsCanvas from "@/components/main/StarsBackground";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import DarkVeil from "@/components/DarkVeil";
import Threads from "@/components/Threads";
import Navbar from "@/components/Navbar";

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
    <html lang="tr" suppressHydrationWarning>
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
        className={`${inter.className} text-white overflow-y-scroll overflow-x-hidden`}
        style={{
          backgroundColor: "#0a0a0a",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <SpeedInsights />
          <Analytics />
          {/* StarsCanvas */}
          <StarsCanvas />
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
          <Navbar />
          <div style={{ position: 'relative', zIndex: 100 }}>
            <PageTransition>{children}</PageTransition>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

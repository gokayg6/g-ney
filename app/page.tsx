"use client";

import About from "@/components/About";
import HomeHero from "@/components/HomeHero";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Statistics from "@/components/Statistics";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import FAQ from "@/components/FAQ";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Fade-up wrapper component
function FadeUpWrapper({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-50px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <main className="h-full w-full relative z-10">
      <div className="flex flex-col gap-8 md:gap-12 pb-8 px-2 sm:px-4">
        <HomeHero />
        <FadeUpWrapper>
          <About />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.1}>
          <Statistics />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.2}>
          <Skills />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.1}>
          <Experience />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.2}>
          <Services />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.1}>
          <Projects />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.2}>
          <Contact />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.1}>
          <FAQ />
        </FadeUpWrapper>
        <FadeUpWrapper delay={0.2}>
          <Footer />
        </FadeUpWrapper>
      </div>
    </main>
  );
}

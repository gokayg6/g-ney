"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SocialIcon } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC<{}> = () => {
  const [socialIcons, setSocialIcons] = useState<SocialIcon[]>([]);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Load social icons from API
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setSocialIcons(data.social || []))
      .catch(() => {
        // Fallback to constant
        setSocialIcons([
          {
            link: "https://github.com/ibrahimmemonn",
            image: "/Github.svg",
            alt: "Ibrahim Memon - Social Media",
          },
          {
            link: "https://www.instagram.com/ibii.memon/?hl=en",
            image: "/Instagram.svg",
            alt: "Ibrahim Memon - Social Media",
          },
          {
            link: "https://www.linkedin.com/in/ibrahimmemonn/",
            image: "/LinkedIn.svg",
            alt: "Ibrahim Memon - Social Media",
          },
          {
            link: "https://twitter.com/Ibrahimmemonnn",
            image: "/Twitter.svg",
            alt: "Ibrahim Memon - Social Media",
          },
        ]);
      });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto max-w-6xl pt-[50px] pb-8 px-4"
    >
      <div className="pb-10 justify-center flex flex-wrap gap-4">
        {socialIcons.map((social, index) => {
          return (
            <motion.div
              key={social.alt || index}
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Link
                href={social.link}
                rel="noopener noreferrer"
                target="_blank"
                className="z-[1]"
              >
                <Image
                  src={social.image}
                  height={30}
                  width={30}
                  alt={social.alt}
                  sizes="100vw"
                  className="mx-2 md:mx-5 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-slate-600 dark:text-gray-300 text-center text-sm transition-colors duration-500"
      >
        
      </motion.p>
    </motion.div>
  );
};

export default Footer;

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AboutData } from "@/lib/data";
import PageHero from "./PageHero";

const About: React.FC<{}> = () => {
  const [data, setData] = useState<AboutData>({
    title: "HAKKIMDA",
    subtitle: "KEŞFET",
    description: "Tutkulu bir yazılım mühendisi olarak, mantık ve yaratıcılık arasındaki karmaşık dansın keyfini çıkarıyorum. Şu anda WebHR'nin dinamik dünyasında, teknolojiyi yenilikle sorunsuz bir şekilde harmanladığım React Native konusunda uzmanlaşmış durumdayım.\n\nZarif çözümler üretme tutkusuyla, sürekli gelişen yazılım geliştirme ortamında ilerliyorum. Yolculuğum, kavramları koda çevirmeyi, sorunsuz kullanıcı deneyimleri yaratmayı ve sürekli olarak mümkün olanın sınırlarını zorlamayı içeriyor.",
  });
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetch("/api/content/about")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => {
        setData({
          title: "HAKKIMDA",
          subtitle: "KEŞFET",
          description: "Tutkulu bir yazılım mühendisi olarak, mantık ve yaratıcılık arasındaki karmaşık dansın keyfini çıkarıyorum. Şu anda WebHR'nin dinamik dünyasında, teknolojiyi yenilikle sorunsuz bir şekilde harmanladığım React Native konusunda uzmanlaşmış durumdayım.\n\nZarif çözümler üretme tutkusuyla, sürekli gelişen yazılım geliştirme ortamında ilerliyorum. Yolculuğum, kavramları koda çevirmeyi, sorunsuz kullanıcı deneyimleri yaratmayı ve sürekli olarak mümkün olanın sınırlarını zorlamayı içeriyor.",
        });
      });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 10 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ 
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <PageHero
          title={data.title}
          subtitle={data.subtitle}
          description={data.description}
          showLogo={false}
        />
      </motion.div>
    </section>
  );
};

export default About;

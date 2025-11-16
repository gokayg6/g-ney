"use client";
import React, { useEffect, useState } from "react";
import { SocialIcon } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC<{}> = () => {
  const [socialIcons, setSocialIcons] = useState<SocialIcon[]>([]);

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
    <div className="container mx-auto max-w-6xl pt-[50px] pb-8 px-4">
      <div className="pb-10 justify-center flex flex-wrap gap-4">
        {socialIcons.map((social, index) => {
          return (
            <Link
              href={social.link}
              rel="noopener noreferrer"
              target="_blank"
              key={social.alt || index}
              className="z-[1]"
            >
              <Image
                src={social.image}
                height={30}
                width={30}
                alt={social.alt}
                sizes="100vw"
                className="mx-2 md:mx-5"
              />
            </Link>
          );
        })}
      </div>
      <p className="text-gray-300 text-center text-sm">
        
      </p>
    </div>
  );
};

export default Footer;

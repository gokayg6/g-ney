"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import type { BlogPost, BlogData } from "@/lib/data";

const fallbackPosts: BlogPost[] = [
  {
    id: "placeholder-1",
    title: "Günlük Notlar: Camomile Tea & Lavanta Atölyesi",
    excerpt:
      "Bugün üretim masasını yeni kokumuz Camomile Tea & French Lavender için hazırladım. Lavanta demetleri stüdyoyu sakinleştiriyor.",
    content: "",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=2400&q=80",
    date: "20 Ocak 2024",
    author: "Loegs",
    category: "journal",
    readTime: "4 dk",
    published: true,
  },
  {
    id: "placeholder-2",
    title: "Stüdyodan Günlük: %25 İndirim Hazırlığı",
    excerpt:
      "Black Friday için etiketleri bastık, paketleri katladık, kahvelerimizi tazeledik. Bu yıl 100.000 ağaç hedefine herkes hazır.",
    content: "",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2400&q=80",
    date: "18 Ocak 2024",
    author: "Loegs",
    category: "campaign",
    readTime: "3 dk",
    published: true,
  },
  {
    id: "placeholder-3",
    title: "Retro Swirl Kutusu ve İlham Panosu",
    excerpt:
      "70'ler posterleri, neon renkler ve eski dergilerle dolu bir masa kurdum.",
    content: "",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=2400&q=80",
    date: "15 Ocak 2024",
    author: "Loegs",
    category: "design",
    readTime: "5 dk",
    published: true,
  },
  {
    id: "placeholder-4",
    title: "Atölyede Genç Misafir: Çocuklar ve Doğal Formüller",
    excerpt:
      "Küçük kuzenim Ada bugün atölyeye geldi; doğal formüller hakkında konuşup notlar aldık.",
    content: "",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=2400&q=80",
    date: "12 Ocak 2024",
    author: "Loegs",
    category: "lifestyle",
    readTime: "4 dk",
    published: true,
  },
];

const defaultMeta = {
  title: "Günlük Blog",
  subtitle: "WE ARE HERE",
  introTitle: "Atölyeden Günlük Notlar",
  introDescription:
    "Stüdyodan günlük notlar, üretim masamızdan kesitler, yeni kokular ve biraz da bambu çubukların sesleri. Her yazı günün sonunda tuttuğumuz küçük bir günlük gibi.",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [meta, setMeta] = useState(defaultMeta);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content/blog")
      .then((res: Response) => res.json())
      .then((data: BlogData) => {
        if (data) {
          const publishedPosts = (data.posts || []).filter(
            (post: BlogPost) => post.published !== false
          );

          setPosts(publishedPosts.length ? publishedPosts : fallbackPosts);
          setMeta({
            title: data.title || defaultMeta.title,
            subtitle: (data.subtitle || defaultMeta.subtitle).toUpperCase(),
            introTitle: data.introTitle || defaultMeta.introTitle,
            introDescription:
              data.introDescription || defaultMeta.introDescription,
          });
        }
      })
      .catch(() => {
        setPosts(fallbackPosts);
        setMeta(defaultMeta);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
        <div className="text-white/80 text-sm tracking-[0.4em] uppercase animate-pulse">
          Yükleniyor
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center">
      {/* HERO / INTRO */}
      <section className="px-4 pt-16 pb-6 text-center">
        <p className="text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] uppercase text-white/60 mb-4 animate-fade-in">
          {meta.subtitle}
        </p>
        <h1 className="font-serif text-[36px] sm:text-[46px] md:text-[60px] lg:text-[70px] text-white mb-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] animate-slide-down leading-tight">
          {meta.title}
        </h1>
        <div className="max-w-3xl mx-auto text-left bg-white/10 backdrop-blur-xl rounded-[24px] md:rounded-[32px] border border-white/20 p-4 sm:p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-scale-in">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            {meta.introTitle}
          </h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            {meta.introDescription}
          </p>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group relative flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] sm:rounded-[24px] md:rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.3)] overflow-hidden animate-fade-in h-full"
              style={{ animationDelay: `${index * 0.05}s`, position: 'relative', zIndex: 1 }}
            >
              {/* üst glow */}
              <div className="pointer-events-none absolute -inset-1 rounded-[20px] sm:rounded-[24px] md:rounded-[28px] bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/20 group-hover:via-white/10 group-hover:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out blur-sm" />

              {/* IMAGE */}
              {post.image && (
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-[20px] sm:rounded-t-[24px] md:rounded-t-[28px]">
                  <Image
                    src={post.image}
                    fill
                    alt={post.title}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 95vw"
                    priority={index < 4}
                  />

                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* image içi content */}
                  <div className="absolute inset-0 flex flex-col justify-end sm:justify-center items-center p-3 sm:p-4 md:p-5 lg:p-6 pointer-events-none z-30">
                    <div className="w-full sm:w-auto text-center transform translate-y-3 sm:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-white text-sm sm:text-base md:text-lg font-semibold mb-2 line-clamp-2 drop-shadow-xl">
                        {post.title}
                      </h4>
                      <p className="hidden sm:block text-white/90 text-xs md:text-sm leading-relaxed line-clamp-2 mb-3 drop-shadow-lg">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* DETAYLARI GÖR BUTONU - Ayrı container, en üstte */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button clicked for post:', post.id);
                      const willBeOpen = expandedPostId !== post.id;
                      setExpandedPostId((prev) =>
                        prev === post.id ? null : post.id
                      );
                      if (willBeOpen) {
                        setTimeout(() => {
                          const detailsSection = document.getElementById(
                            `post-details-${post.id}`
                          );
                          if (detailsSection) {
                            detailsSection.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                            });
                          }
                        }, 200);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button mousedown for post:', post.id);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button touch for post:', post.id);
                    }}
                    className="absolute inset-0 flex items-center justify-center z-[100000] opacity-100 sm:opacity-30 sm:group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-white bg-white/40 backdrop-blur-xl border-2 border-white/80 hover:bg-white/50 active:bg-white/60 hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_15px_40px_rgba(255,255,255,0.4)] min-w-[110px] sm:min-w-[130px] md:min-w-[150px] lg:min-w-[170px]"
                    style={{
                      zIndex: 100000,
                      position: "absolute",
                      pointerEvents: "auto",
                      cursor: "pointer",
                      touchAction: "manipulation",
                      isolation: "isolate",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span className="whitespace-nowrap font-extrabold">DETAYLARI GÖR</span>
                    <svg
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 flex-shrink-0 transition-transform duration-300 ${
                        expandedPostId === post.id ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* CARD CONTENT */}
              <div className="relative z-10 flex flex-col flex-1 p-3 sm:p-4 md:p-5 lg:p-6 bg-black/10 group-hover:bg-black/20 transition-colors duration-500">
                {/* üst meta */}
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/50 mb-3">
                  <span className="truncate">
                    {post.category || "NEWS"}
                  </span>
                  <span>{post.readTime || "3 dk"}</span>
                </div>

                {/* title + excerpt */}
                <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-white">
                  {post.title}
                </h3>
                <p className="text-white/70 text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-3 mb-3 group-hover:text-white/85">
                  {post.excerpt}
                </p>

                {/* alt kısım */}
                <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-white/40 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase">
                    {post.date}
                  </span>

                  {/* ok butonu: kart içi expandable alanı aç/kapat */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpandedPostId((prev) =>
                        prev === post.id ? null : post.id
                      );
                    }}
                    className="flex items-center justify-center min-w-[38px] sm:min-w-[42px] md:min-w-[46px] min-h-[38px] sm:min-h-[42px] md:min-h-[46px] rounded-full bg-white/10 hover:bg-white/25 text-white text-lg sm:text-xl font-bold transition-all duration-200"
                    aria-expanded={expandedPostId === post.id}
                  >
                    <span
                      className={`block transform transition-transform duration-300 ${
                        expandedPostId === post.id ? "rotate-90" : ""
                      }`}
                    >
                      →
                    </span>
                  </button>
                </div>

                 {/* EXPANDED CONTENT */}
                 {expandedPostId === post.id && (
                   <div
                     id={`post-details-${post.id}`}
                     className="mt-4 pt-4 border-t border-white/20 animate-fade-in"
                   >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-5 md:p-6 border border-white/25">
                      <h4 className="text-white text-base sm:text-lg md:text-xl font-bold mb-3">
                        {post.title}
                      </h4>

                      <div className="space-y-3 sm:space-y-4 text-white/95 text-sm sm:text-base leading-relaxed">
                        {post.content && post.content.trim() ? (
                          post.content
                            .split("\n")
                            .filter((paragraph: string) => paragraph.trim())
                            .map((paragraph: string, idx: number) => (
                              <p
                                key={idx}
                                className="animate-fade-in"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                              >
                                {paragraph}
                              </p>
                            ))
                        ) : (
                          <p className="text-white/70 italic">
                            İçerik bulunamadı.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex flex-wrap gap-2 text-white/60 text-[11px] sm:text-xs">
                          {post.author && <span>{post.author}</span>}
                          {post.readTime && (
                            <>
                              <span>•</span>
                              <span>{post.readTime}</span>
                            </>
                          )}
                          {post.category && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 rounded-full bg-white/10">
                                {post.category}
                              </span>
                            </>
                          )}
                        </div>

                        <Link
                          href={`/blog/${post.id}`}
                          className="text-white/70 hover:text-white text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.18em] sm:tracking-[0.2em] flex items-center gap-1.5 transition-colors"
                        >
                          <span>Devamını oku</span>
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

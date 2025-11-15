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
    title:
      "Atölyede Genç Misafir: Çocuklar ve Doğal Formüller",
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
      .catch((_error: unknown) => {
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
      <section className="px-4 pt-16 pb-4 text-center">
        <p className="text-xs tracking-[0.6em] uppercase text-white/60 mb-5 animate-fade-in">
          {meta.subtitle}
        </p>
        <h1 className="font-serif text-[50px] md:text-[70px] text-white mb-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] animate-slide-down">
          {meta.title}
        </h1>
        <div className="max-w-3xl mx-auto text-left bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-scale-in">
          <h2 className="text-white text-xl font-semibold mb-3">
            {meta.introTitle}
          </h2>
          <p className="text-white/80 leading-relaxed">
            {meta.introDescription}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="blog-card group rounded-[32px] sm:rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_18px_60px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-fade-in relative"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Hover blur overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-50 rounded-[32px] sm:rounded-[36px] pointer-events-none" />

              {/* View Details Button */}
              <div className="absolute inset-0 flex items-center justify-center z-[60] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/blog/${post.id}`;
                  }}
                  className="view-details-btn px-8 sm:px-10 md:px-12 py-4 sm:py-4.5 md:py-5 rounded-full text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-[0.25em] text-white bg-white/30 backdrop-blur-xl border-2 border-white/70 hover:bg-white/40 active:bg-white/50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_20px_60px_rgba(255,255,255,0.4)] pointer-events-auto cursor-pointer"
                  style={{
                    zIndex: 1000000,
                    position: "relative",
                    pointerEvents: "auto",
                  }}
                >
                  VIEW DETAILS
                </button>
              </div>

              {/* Hover glow */}
              <div className="absolute -inset-1 rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/20 group-hover:via-white/10 group-hover:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none blur-sm" />

              {post.image && (
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-[32px] sm:rounded-t-[36px]">
                  <Image
                    src={post.image}
                    fill
                    alt={post.title}
                    className="object-cover"
                    sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                    priority={index < 4}
                  />
                  {/* Image hover content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-center items-center p-4 sm:p-5 md:p-6 z-20">
                    <div className="transform translate-y-8 scale-95 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] text-center w-full px-2 sm:px-4">
                      <h4 className="text-white text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-white/95 text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
                        {post.excerpt}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/blog/${post.id}`;
                        }}
                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-full text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white bg-white/30 backdrop-blur-lg border-2 border-white/60 hover:bg-white/40 active:bg-white/50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl min-h-[40px] sm:min-h-[44px] md:min-h-[48px] w-full sm:w-auto font-semibold"
                        style={{
                          zIndex: 9999,
                          position: "relative",
                          pointerEvents: "auto",
                        }}
                      >
                        <span className="whitespace-nowrap">Detayları Gör</span>
                        <svg
                          className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 transform group-hover:translate-x-1 transition-transform duration-300"
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
                  </div>
                </div>
              )}

              <div className="p-4 sm:p-5 md:p-7 flex flex-col flex-1 relative z-10 group-hover:bg-white/5 transition-all duration-500 rounded-b-[32px] sm:rounded-b-[36px]">
                <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/50 mb-3 sm:mb-4 group-hover:text-white/70 transition-colors duration-500">
                  <span className="truncate transform group-hover:scale-105 transition-transform duration-300 inline-block">
                    {post.category || "NEWS"}
                  </span>
                  <span className="ml-2 transform group-hover:scale-105 transition-transform duration-300 inline-block">
                    {post.readTime || "3 dk"}
                  </span>
                </div>

                <h3 className="text-white text-xl sm:text-2xl font-semibold leading-snug mb-2 sm:mb-3 group-hover:text-white transition-colors duration-500 line-clamp-2 transform group-hover:scale-[1.02] group-hover:translate-x-1 transition-all duration-500">
                  {post.title}
                </h3>

                <p className="text-white/70 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-3 group-hover:text-white/85 transition-colors duration-500 transform group-hover:translate-x-0.5 transition-transform duration-500">
                  {post.excerpt}
                </p>

                <div className="mt-4 sm:mt-5 flex items-center justify-between pt-2 border-t border-white/10 group-hover:border-white/20 transition-colors duration-500">
                  <span className="text-white/40 text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] uppercase group-hover:text-white/60 transition-colors duration-500 transform group-hover:scale-105 transition-transform duration-300">
                    {post.date}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const nextExpandedId =
                        expandedPostId === post.id ? null : post.id;

                      setExpandedPostId(nextExpandedId);

                      if (nextExpandedId) {
                        requestAnimationFrame(() => {
                          const detailsSection = document.getElementById(
                            `post-details-${post.id}`
                          );
                          detailsSection?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        });
                      }
                    }}
                    className="arrow-button text-white/70 hover:text-white text-lg sm:text-xl md:text-2xl font-bold cursor-pointer min-w-[44px] sm:min-w-[48px] md:min-w-[52px] min-h-[44px] sm:min-h-[48px] md:min-h-[52px] flex items-center justify-center rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200"
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

                {expandedPostId === post.id && (
                  <div
                    id={`post-details-${post.id}`}
                    className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t-2 border-white/30 animate-fade-in overflow-hidden"
                  >
                    <div className="bg-white/15 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-white/30 shadow-2xl">
                      <h4 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5">
                        {post.title}
                      </h4>

                      <div className="space-y-4 sm:space-y-5 text-white/95 text-sm sm:text-base md:text-lg leading-relaxed">
                        {post.content && post.content.trim() ? (
                          post.content
                            .split("\n")
                            .filter(
                              (paragraph: string) =>
                                paragraph.trim().length > 0
                            )
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
                          <p className="text-white/70 italic text-base">
                            İçerik bulunamadı.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-white/50 text-[10px] sm:text-xs">
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
                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                                {post.category}
                              </span>
                            </>
                          )}
                        </div>

                        <Link
                          href={`/blog/${post.id}`}
                          className="text-white/60 hover:text-white text-xs sm:text-sm uppercase tracking-[0.2em] transition-colors duration-300 flex items-center gap-1.5 sm:gap-2"
                        >
                          <span>Devamını oku</span>
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
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

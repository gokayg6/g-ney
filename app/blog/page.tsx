"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
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
  title: "Blog",
  subtitle: "BURADAYIZ",
  introTitle: "Atölyeden Günlük Notlar",
  introDescription:
    "Stüdyodan günlük notlar, üretim masamızdan kesitler, yeni kokular ve biraz da bambu çubukların sesleri. Her yazı günün sonunda tuttuğumuz küçük bir günlük gibi.",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [meta, setMeta] = useState(defaultMeta);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // Load liked posts and like counts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('blog-liked-posts');
      if (stored) {
        const likedArray = JSON.parse(stored) as string[];
        setLikedPosts(new Set(likedArray));
      }
      
      const storedCounts = localStorage.getItem('blog-like-counts');
      if (storedCounts) {
        const counts = JSON.parse(storedCounts) as Record<string, number>;
        setLikeCounts(counts);
      }
    } catch (error) {
      console.error('Error loading liked posts:', error);
    }
  }, []);

  useEffect(() => {
    // Fetch in background without blocking render
    fetch("/api/content/blog")
      .then((res: Response) => res.json())
      .then((data: BlogData) => {
        if (data) {
          const publishedPosts = (data.posts || []).filter(
            (post: BlogPost) => post.published !== false
          );

          if (publishedPosts.length > 0) {
            setPosts(publishedPosts);
          }
          if (data.subtitle || data.introTitle || data.introDescription) {
            setMeta((prevMeta) => ({
              title: "Blog", // Always keep as "Blog"
              subtitle: (data.subtitle || defaultMeta.subtitle).toUpperCase(),
              introTitle: data.introTitle || defaultMeta.introTitle,
              introDescription:
                data.introDescription || defaultMeta.introDescription,
            }));
          }
        }
      })
      .catch(() => {
        // Silent fail, keep fallback
      });
  }, []);

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      const wasLiked = newSet.has(postId);
      
      if (wasLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      
      // Update like counts
      setLikeCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        if (wasLiked) {
          // Decrease count
          newCounts[postId] = Math.max(0, (newCounts[postId] || 0) - 1);
        } else {
          // Increase count
          newCounts[postId] = (newCounts[postId] || 0) + 1;
        }
        
        // Save to localStorage
        try {
          localStorage.setItem('blog-liked-posts', JSON.stringify(Array.from(newSet)));
          localStorage.setItem('blog-like-counts', JSON.stringify(newCounts));
        } catch (error) {
          console.error('Error saving liked posts:', error);
        }
        
        return newCounts;
      });
      
      return newSet;
    });
  };

  return (
    <main className="min-h-screen relative z-10">
      {/* HERO / INTRO */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <PageHero
          title={meta.title}
          subtitle={meta.subtitle}
          description={`${meta.introTitle}\n\n${meta.introDescription}`}
          showLogo={true}
        />
      </motion.div>

      {/* BLOG GRID */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="px-3 sm:px-4 md:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group relative flex flex-col bg-white/90 dark:bg-transparent border border-slate-200 dark:border-white/20 rounded-xl sm:rounded-2xl shadow-lg dark:shadow-xl overflow-hidden animate-fade-in h-full transition-all duration-500"
              style={{ animationDelay: `${index * 0.05}s`, position: 'relative', zIndex: 1 }}
            >
              {/* üst glow */}
              <div className="pointer-events-none absolute -inset-1 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/20 group-hover:via-white/10 group-hover:to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out blur-sm" />

              {/* IMAGE */}
              {post.image && (
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-xl sm:rounded-t-2xl">
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
                    className="absolute inset-0 flex items-center justify-center z-[100000] opacity-100 sm:opacity-30 sm:group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-slate-900 dark:text-white bg-white/90 dark:bg-white/40 border-2 border-slate-300 dark:border-white/80 hover:bg-white dark:hover:bg-white/50 active:bg-slate-100 dark:active:bg-white/60 hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_15px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_15px_40px_rgba(255,255,255,0.4)] min-w-[110px] sm:min-w-[130px] md:min-w-[150px] lg:min-w-[170px]"
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
              <div className="relative z-10 flex flex-col flex-1 p-3 sm:p-4 md:p-4 bg-transparent group-hover:bg-transparent transition-colors duration-500">
                {/* üst meta */}
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500 dark:text-white/50 mb-3 transition-colors duration-500">
                  <span className="truncate">
                    {post.category || "NEWS"}
                  </span>
                  <span>{post.readTime || "3 dk"}</span>
                </div>

                {/* title + excerpt */}
                <h3 className="text-slate-900 dark:text-slate-50 text-base sm:text-lg md:text-xl font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-500">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-3 mb-3 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-500">
                  {post.excerpt}
                </p>

                {/* alt kısım */}
                <div className="mt-auto pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 transition-colors duration-500">
                  <span className="text-slate-400 dark:text-white/40 text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-colors duration-500">
                    {post.date}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Beğeni butonu */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                        likedPosts.has(post.id)
                          ? "bg-red-500/30 border border-red-500/50 text-red-200 hover:bg-red-500/40"
                          : "bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 transition-colors duration-500"
                      }`}
                      title={likedPosts.has(post.id) ? "Beğenildi" : "Beğen"}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                          likedPosts.has(post.id) ? "fill-current" : "fill-none"
                        }`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="hidden sm:inline">
                        {likedPosts.has(post.id) ? "Beğenildi" : "Beğen"}
                      </span>
                      {(likeCounts[post.id] || 0) > 0 && (
                        <span className="text-[10px] sm:text-xs font-semibold">
                          ({likeCounts[post.id] || 0})
                        </span>
                      )}
                    </button>

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
                    className="flex items-center justify-center min-w-[38px] sm:min-w-[42px] md:min-w-[46px] min-h-[38px] sm:min-h-[42px] md:min-h-[46px] rounded-full bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/25 text-slate-900 dark:text-white text-lg sm:text-xl font-bold transition-all duration-200"
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
                </div>

                 {/* EXPANDED CONTENT */}
                 {expandedPostId === post.id && (
                   <div
                     id={`post-details-${post.id}`}
                     className="mt-4 pt-4 border-t border-slate-300 dark:border-white/20 animate-fade-in transition-colors duration-500"
                   >
                    <div className="bg-white/90 dark:bg-transparent rounded-2xl p-4 sm:p-4 md:p-5 border border-slate-200 dark:border-white/20 shadow-lg dark:shadow-xl transition-colors duration-500">
                      <h4 className="text-slate-900 dark:text-slate-50 text-base sm:text-lg md:text-xl font-bold mb-3 transition-colors duration-500">
                        {post.title}
                      </h4>

                      <div className="space-y-3 sm:space-y-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed transition-colors duration-500">
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
                          <p className="text-slate-600 dark:text-white/70 italic transition-colors duration-500">
                            İçerik bulunamadı.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/15 flex items-center justify-between gap-3 flex-wrap transition-colors duration-500">
                        <div className="flex flex-wrap gap-2 text-slate-600 dark:text-white/60 text-[11px] sm:text-xs transition-colors duration-500">
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

                        <div className="flex items-center gap-3">
                          {/* Beğeni butonu - expanded content içinde */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLike(post.id);
                            }}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                              likedPosts.has(post.id)
                                ? "bg-red-500/30 border border-red-500/50 text-red-200 hover:bg-red-500/40"
                                : "bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 transition-colors duration-500"
                            }`}
                            title={likedPosts.has(post.id) ? "Beğenildi" : "Beğen"}
                          >
                            <svg
                              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                                likedPosts.has(post.id) ? "fill-current" : "fill-none"
                              }`}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            <span>{likedPosts.has(post.id) ? "Beğenildi" : "Beğen"}</span>
                            {(likeCounts[post.id] || 0) > 0 && (
                              <span className="text-xs sm:text-sm font-semibold">
                                ({likeCounts[post.id] || 0})
                              </span>
                            )}
                          </button>

                        <Link
                          href={`/blog/${post.id}`}
                          className="text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.18em] sm:tracking-[0.2em] flex items-center gap-1.5 transition-colors duration-500"
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
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Footer />
      </motion.div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import type { BlogPost } from "@/lib/data";

export default function BlogPostPage() {
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    fetch("/api/content/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.posts) {
          const published: BlogPost[] = data.posts.filter(
            (blog: BlogPost) => blog.published !== false
          );
          const found = published.find((blog: BlogPost) => blog.id === postId);
          setPost(found || null);
          setAllPosts(published);
        }
      })
      .catch(() => {
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return allPosts.filter((item) => item.id !== post.id).slice(0, 3);
  }, [allPosts, post]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
        <div className="text-white/80 tracking-[0.3em] uppercase text-sm animate-pulse">
          Yükleniyor...
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <h1 className="text-white text-2xl sm:text-3xl font-serif mb-3">
            Yazı bulunamadı
          </h1>
          <p className="text-white/70 text-sm sm:text-base mb-6">
            Aradığınız blog yazısı silinmiş veya hiç eklenmemiş olabilir.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] text-white bg-white/15 border border-white/40 hover:bg-white/25 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Blog sayfasına dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center min-h-screen">
      {/* HERO GÖRSEL */}
      <div className="relative h-[260px] sm:h-[360px] md:h-[460px] lg:h-[520px]">
        {post.image && (
          <Image
            src={post.image}
            fill
            alt={post.title}
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/20" />
        <div className="absolute inset-x-4 sm:inset-x-6 md:inset-x-8 bottom-10 sm:bottom-14 md:bottom-16 flex justify-center">
          <div className="w-full max-w-4xl text-center">
            <p className="text-white/70 text-[10px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] uppercase mb-2 sm:mb-3 animate-fade-in">
              Günlük Not
            </p>
            <h1 className="font-serif text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight animate-slide-down">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ANA İÇERİK KARTI */}
      <article className="relative max-w-4xl mx-auto -mt-14 sm:-mt-18 md:-mt-24 mb-10 sm:mb-14 md:mb-20 px-3 sm:px-4">
        <div className="relative bg-black/40 md:bg-black/35 backdrop-blur-2xl rounded-[22px] sm:rounded-[28px] md:rounded-[36px] shadow-[0_26px_80px_rgba(0,0,0,0.6)] p-4 sm:p-6 md:p-8 lg:p-10 border border-white/20">
          {/* geri linki */}
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/65 hover:text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Geri dön
            </Link>

            <span className="hidden sm:inline text-white/45 text-[10px] sm:text-xs uppercase tracking-[0.25em]">
              BLOG YAZISI
            </span>
          </div>

          {/* meta bilgiler */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-white/55 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-5 sm:mb-7">
            {post.date && <span>{post.date}</span>}
            {post.author && (
              <>
                <span>•</span>
                <span>{post.author}</span>
              </>
            )}
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime}</span>
              </>
            )}
            {post.category && (
              <>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/75 text-[9px] sm:text-[11px]">
                  {post.category}
                </span>
              </>
            )}
          </div>

          {/* içerik */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 text-white/90 leading-relaxed text-sm sm:text-base md:text-lg blog-content">
            {post.content
              ?.split("\n")
              .filter((paragraph) => paragraph.trim().length)
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {paragraph}
                </p>
              )) || (
              <p className="text-white/70 italic">
                Bu yazı için içerik bulunamadı.
              </p>
            )}
          </div>

          {/* alt aksiyonlar */}
          <div className="mt-7 sm:mt-9 md:mt-10 pt-5 sm:pt-6 border-t border-white/15 flex flex-wrap gap-3 sm:gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: post.title,
                        text: post.excerpt || "",
                        url: window.location.href,
                      })
                      .catch(() => undefined);
                  } else {
                    navigator.clipboard
                      .writeText(window.location.href)
                      .catch(() => undefined);
                  }
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.18em] text-white bg-white/10 border border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>Paylaş</span>
              </button>

              <LikeButton />
            </div>

            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="mt-1 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 bg-white/5 border border-white/20 hover:bg-white/15 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Başa dön</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>

      {/* İLGİLİ YAZILAR (opsiyonel ama tasarıma uyumlu) */}
      {relatedPosts.length > 0 && (
        <section className="px-3 sm:px-4 md:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
              Diğer günlük notlar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.id}`}
                  className="group flex gap-3 sm:gap-4 bg-black/35 backdrop-blur-xl rounded-2xl border border-white/15 overflow-hidden hover:border-white/30 hover:bg-black/45 transition-all duration-200"
                >
                  {rp.image && (
                    <div className="relative w-24 sm:w-28 md:w-32 aspect-[4/5] flex-shrink-0 overflow-hidden">
                      <Image
                        src={rp.image}
                        alt={rp.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="160px"
                      />
                    </div>
                  )}
                  <div className="py-3 sm:py-4 pr-3 sm:pr-4 flex flex-col">
                    <p className="text-white/50 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] mb-1">
                      {rp.category || "JOURNAL"}
                    </p>
                    <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold line-clamp-2 mb-1.5">
                      {rp.title}
                    </h3>
                    <p className="text-white/65 text-[11px] sm:text-xs line-clamp-2">
                      {rp.excerpt}
                    </p>
                    <span className="mt-auto pt-1 text-white/40 text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">
                      Devamını oku →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

// Basit beğen butonu (state'li, responsive)
function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setLiked((prev) => !prev)}
      className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.18em] border transition-all duration-200 ${
        liked
          ? "text-black bg-white border-white hover:bg-white/90"
          : "text-white bg-white/10 border-white/30 hover:bg-white/20"
      } hover:scale-105 active:scale-95`}
    >
      <svg
        className="w-4 h-4"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={liked ? 0 : 2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{liked ? "Beğenildi" : "Beğen"}</span>
    </button>
  );
}

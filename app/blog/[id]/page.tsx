"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { BlogPost } from "@/lib/data";

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    fetch("/api/content/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.posts) {
          const published = data.posts.filter(
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
    return allPosts
      .filter((item) => item.id !== post.id)
      .slice(0, 3);
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
      <main className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-serif mb-4">
            Yazı bulunamadı
          </h1>
          <Link
            href="/blog"
            className="text-white/80 underline hover:text-white transition-colors duration-300"
          >
            Blog sayfasına dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center min-h-screen">
      <div className="relative h-[300px] sm:h-[420px] md:h-[520px] bg-[#d6cfc3]">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-8 sm:bottom-16 left-1/2 -translate-x-1/2 text-center px-4 w-full max-w-4xl">
          <p className="text-white/70 text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-2 sm:mb-4 animate-fade-in">
            Günlük Not
          </p>
          <h1 className="font-serif text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight animate-slide-down">
            {post.title}
          </h1>
        </div>
      </div>

      <article className="group relative max-w-4xl mx-auto -mt-16 sm:-mt-20 md:-mt-32 mb-8 sm:mb-12 md:mb-16 bg-white/10 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] md:rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.4)] p-4 sm:p-6 md:p-8 lg:p-12 border border-white/20 animate-scale-in mx-3 sm:mx-4 md:mx-auto">
        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-50 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] pointer-events-none" />
        
        {/* View Button */}
        <div className="absolute inset-0 flex items-center justify-center z-[60] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Scroll to top of content or do nothing since we're already viewing
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 sm:px-10 md:px-12 py-4 sm:py-4.5 md:py-5 rounded-full text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-[0.25em] text-white bg-white/30 backdrop-blur-xl border-2 border-white/70 hover:bg-white/40 active:bg-white/50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_20px_60px_rgba(255,255,255,0.4)] pointer-events-auto cursor-pointer touch-manipulation"
            style={{
              zIndex: 1000000,
              position: "relative",
              pointerEvents: "auto",
            }}
          >
            VIEW
          </button>
        </div>

        <div className="relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 uppercase tracking-[0.3em] text-xs mb-6 hover:text-white transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri dön
          </Link>

        <div className="flex flex-wrap gap-2 sm:gap-4 text-white/50 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-10">
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
              <span className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-[10px] sm:text-xs">
                {post.category}
              </span>
            </>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6 text-white/90 leading-relaxed text-base sm:text-lg blog-content">
          {post.content
            ?.split("\n")
            .filter((paragraph) => paragraph.trim().length)
            .map((paragraph, index) => (
              <p key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {paragraph}
              </p>
            ))}
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20 flex flex-wrap gap-3 sm:gap-4">
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] text-white bg-white/10 border border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Paylaş</span>
          </button>
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] text-white bg-white/10 border border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Beğen</span>
          </button>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 animate-fade-in">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-white">
              Benzer Yazılar
            </h2>
            <Link
              href="/blog"
              className="text-white/60 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs hover:text-white transition-colors duration-300"
            >
              Tüm Yazılar
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedPosts.map((item, index) => (
              <Link
                key={item.id}
                href={`/blog/${item.id}`}
                className="group bg-white/10 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] border border-white/20 shadow-[0_18px_60px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.image && (
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src={item.image}
                      fill
                      alt={item.title}
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    />
                  </div>
                )}
                <div className="px-5 sm:px-6 py-5 sm:py-6">
                  <span className="text-white/50 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase">
                    {item.category || "News"}
                  </span>
                  <h3 className="text-white text-base sm:text-lg font-semibold leading-snug mt-2 sm:mt-3 mb-2 line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                  <div className="mt-3 sm:mt-4 flex items-center text-white/60 text-xs group-hover:text-white transition-colors duration-300">
                    <span>Devamını oku</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

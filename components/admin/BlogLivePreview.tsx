"use client";

import Image from "next/image";
import React from "react";
import type { BlogPost } from "@/lib/data";

interface BlogLivePreviewProps {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date?: string;
  author?: string;
  category?: string;
  readTime?: string;
  published?: boolean;
  tags?: string;
}

const BlogLivePreview: React.FC<BlogLivePreviewProps> = ({
  title,
  excerpt,
  content,
  image,
  date,
  author = "Loegs",
  category = "NEWS",
  readTime = "5 dk",
  published = false,
  tags = "",
}) => {
  const tagsArray = tags
    ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];

  const displayDate = date || new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-transparent transition-colors duration-500">
      {/* Canlı Önizleme Badge */}
      <div className="sticky top-0 z-10 bg-blue-500 text-white text-xs font-semibold px-4 py-2 text-center shadow-md">
        🔴 Canlı Önizleme
      </div>

      {/* Blog Content */}
      <article className="max-w-2xl mx-auto px-4 py-8 bg-white dark:bg-transparent">
        {/* Kapak Görseli */}
        {image ? (
          <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={image}
              alt={title || "Blog görseli"}
              fill
              className="object-cover"
              onError={(e) => {
                // Hata durumunda placeholder göster
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop";
              }}
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-orange-500/20 flex items-center justify-center shadow-xl">
            <div className="text-6xl opacity-50">📝</div>
          </div>
        )}

        {/* Meta Bilgiler */}
        <div className="mb-6 space-y-3">
          {/* Yayın Durumu Badge */}
          <div className="flex items-center gap-2">
            {published ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30">
                ✓ Yayında
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30">
                📝 Taslak
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {category}
            </span>
          </div>

          {/* Başlık */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4 transition-colors duration-500">
            {title || "Blog Başlığı"}
          </h1>

          {/* Kısa Açıklama */}
          {excerpt && (
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 transition-colors duration-500">
              {excerpt}
            </p>
          )}

          {/* Tarih, Yazar, Okuma Süresi */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors duration-500">
            <span>{displayDate}</span>
            <span>•</span>
            <span>{author}</span>
            <span>•</span>
            <span>{readTime} okuma</span>
          </div>

          {/* Tagler */}
          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {tagsArray.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors duration-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* İçerik */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="text-slate-900 dark:text-slate-300 leading-relaxed whitespace-pre-wrap transition-colors duration-500 text-base">
            {content || (
              <p className="text-slate-500 dark:text-slate-500 italic">
                İçerik buraya gelecek...
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogLivePreview;


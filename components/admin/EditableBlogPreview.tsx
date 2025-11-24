"use client";

import Image from "next/image";
import React, { useState } from "react";

interface EditableBlogPreviewProps {
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
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onImageChange: (file: File) => Promise<void>;
  onCategoryChange: (value: string) => void;
  onPublishedChange: (value: boolean) => void;
  onTagsChange: (value: string) => void;
}

const EditableBlogPreview: React.FC<EditableBlogPreviewProps> = ({
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
  onTitleChange,
  onExcerptChange,
  onContentChange,
  onImageChange,
  onCategoryChange,
  onPublishedChange,
  onTagsChange,
}) => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const tagsArray = tags
    ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];

  const displayDate = date || new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUploading(true);
      try {
        await onImageChange(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Görsel yüklenirken bir hata oluştu.");
      } finally {
        setImageUploading(false);
        e.target.value = "";
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-transparent transition-colors duration-500">
      {/* Canlı Önizleme Badge */}
      <div className="sticky top-0 z-10 bg-blue-500 text-white text-xs font-semibold px-4 py-2 text-center shadow-md">
        🔴 Canlı Önizleme - Tıklayarak Düzenleyin
      </div>

      {/* Blog Content */}
      <article className="max-w-3xl mx-auto px-4 py-8 bg-white dark:bg-transparent">
        {/* Kapak Görseli - Düzenlenebilir */}
        <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden shadow-xl">
          {image ? (
            <Image
              src={image}
              alt={title || "Blog görseli"}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop";
              }}
            />
          ) : (
            <div className="relative w-full h-full bg-gradient-to-br from-purple-500/20 to-orange-500/20 flex items-center justify-center">
              <div className="text-6xl opacity-50">📝</div>
            </div>
          )}
          
          {/* Görsel Değiştir Butonu - Her zaman görünür */}
          <div className="absolute top-4 right-4">
            <label className="px-4 py-2 bg-white dark:bg-white/20 backdrop-blur-sm border-2 border-slate-300 dark:border-white/30 rounded-lg text-slate-900 dark:text-white text-sm font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-white/30 transition-all duration-200 shadow-lg flex items-center gap-2">
              {imageUploading ? (
                <>
                  <span>⏳</span>
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <>
                  <span>📷</span>
                  <span>Görsel Değiştir</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
            </label>
          </div>
        </div>

        {/* Meta Bilgiler */}
        <div className="mb-6 space-y-3">
          {/* Yayın Durumu ve Kategori - Düzenlenebilir */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => onPublishedChange(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-slate-900 dark:accent-white/60"
              />
              {published ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30">
                  ✓ Yayında
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30">
                  📝 Taslak
                </span>
              )}
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
            >
              <option value="NEWS">NEWS</option>
              <option value="DESIGN">DESIGN</option>
              <option value="TECH">TECH</option>
              <option value="LIFESTYLE">LIFESTYLE</option>
              <option value="JOURNAL">JOURNAL</option>
            </select>
          </div>

          {/* Başlık - Düzenlenebilir */}
          <h1
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const text = e.currentTarget.textContent?.trim() || "";
              onTitleChange(text);
              if (!text) {
                e.currentTarget.textContent = "Blog Başlığı";
                e.currentTarget.classList.add("text-slate-400", "dark:text-slate-500", "italic");
              } else {
                e.currentTarget.classList.remove("text-slate-400", "dark:text-slate-500", "italic");
              }
            }}
            onFocus={(e) => {
              if (e.currentTarget.textContent === "Blog Başlığı") {
                e.currentTarget.textContent = "";
                e.currentTarget.classList.remove("text-slate-400", "dark:text-slate-500", "italic");
              }
            }}
            className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 transition-colors duration-500 outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-2 py-1 -mx-2 -my-1 cursor-text hover:bg-slate-50/50 dark:hover:bg-white/5 ${
              !title ? "text-slate-400 dark:text-slate-500 italic" : "text-slate-900 dark:text-white"
            }`}
            style={{ minHeight: "1.2em" }}
          >
            {title || "Blog Başlığı"}
          </h1>

          {/* Kısa Açıklama - Düzenlenebilir */}
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const text = e.currentTarget.textContent?.trim() || "";
              onExcerptChange(text);
              if (!text) {
                e.currentTarget.textContent = "Kısa açıklama buraya gelecek...";
                e.currentTarget.classList.add("text-slate-400", "dark:text-slate-500", "italic");
              } else {
                e.currentTarget.classList.remove("text-slate-400", "dark:text-slate-500", "italic");
              }
            }}
            onFocus={(e) => {
              if (e.currentTarget.textContent === "Kısa açıklama buraya gelecek...") {
                e.currentTarget.textContent = "";
                e.currentTarget.classList.remove("text-slate-400", "dark:text-slate-500", "italic");
              }
            }}
            className={`text-lg md:text-xl leading-relaxed mb-6 transition-colors duration-500 outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-2 py-1 -mx-2 -my-1 cursor-text hover:bg-slate-50/50 dark:hover:bg-white/5 ${
              !excerpt ? "text-slate-400 dark:text-slate-500 italic" : "text-slate-600 dark:text-slate-300"
            }`}
            style={{ minHeight: "1.5em" }}
          >
            {excerpt || "Kısa açıklama buraya gelecek..."}
          </p>

          {/* Tarih, Yazar, Okuma Süresi */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors duration-500">
            <span>{displayDate}</span>
            <span>•</span>
            <span>{author}</span>
            <span>•</span>
            <span>{readTime} okuma</span>
          </div>

          {/* Tagler - Düzenlenebilir */}
          <div className="flex flex-wrap gap-2 pt-4">
            <input
              type="text"
              value={tags}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="Tagler (virgülle ayırın)"
              className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 min-w-[200px]"
            />
            {tagsArray.length > 0 && (
              <>
                {tagsArray.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/20 transition-colors duration-500"
                  >
                    #{tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* İçerik - Düzenlenebilir */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const text = e.currentTarget.textContent?.trim() || "";
              onContentChange(text);
              if (!text) {
                e.currentTarget.textContent = "İçerik buraya gelecek... Tıklayarak düzenleyin.";
                e.currentTarget.classList.add("text-slate-400", "dark:text-slate-500", "italic");
              } else {
                e.currentTarget.classList.remove("text-slate-400", "dark:text-slate-500", "italic");
              }
            }}
            onFocus={(e) => {
              if (e.currentTarget.textContent === "İçerik buraya gelecek... Tıklayarak düzenleyin.") {
                e.currentTarget.textContent = "";
                e.currentTarget.classList.remove("text-slate-400", "dark:text-slate-500", "italic");
              }
            }}
            className={`leading-relaxed whitespace-pre-wrap transition-colors duration-500 text-base outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-2 py-1 -mx-2 -my-1 cursor-text hover:bg-slate-50/50 dark:hover:bg-white/5 ${
              !content ? "text-slate-400 dark:text-slate-500 italic" : "text-slate-900 dark:text-slate-300"
            }`}
            style={{ minHeight: "200px" }}
          >
            {content || "İçerik buraya gelecek... Tıklayarak düzenleyin."}
          </div>
        </div>
      </article>
    </div>
  );
};

export default EditableBlogPreview;


"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/data";
import EditableBlogPreview from "@/components/admin/EditableBlogPreview";
import StarsCanvas from "@/components/main/StarsBackground";
import { FiCamera, FiClock, FiSave, FiBookOpen, FiPlus } from "react-icons/fi";

interface BlogFormState {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  published: boolean;
  tags: string;
}

export default function AdminBlogEditor() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState<BlogFormState>({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    date: new Date().toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    author: "Loegs",
    category: "NEWS",
    readTime: "5 dk",
    published: false,
    tags: "",
  });

  // Load single blog
  const loadBlog = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/content/blog", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (data && data.posts) {
        const blog = data.posts.find((b: BlogPost) => b.id === id);
        if (blog) {
          setForm({
            id: blog.id,
            title: blog.title || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            image: blog.image || "",
            date: blog.date || new Date().toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            author: blog.author || "Loegs",
            category: blog.category || "NEWS",
            readTime: blog.readTime || "5 dk",
            published: blog.published !== false,
            tags: blog.tags || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading blog:", error);
    }
  }, []);

  // Load blogs list
  const loadBlogs = useCallback(async () => {
    try {
      const res = await fetch("/api/content/blog", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (data && data.posts) {
        setBlogs(data.posts);
        // İlk blogu seç
        if (data.posts.length > 0 && !selectedBlogId) {
          setSelectedBlogId(data.posts[0].id);
          loadBlog(data.posts[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  }, [selectedBlogId, loadBlog]);

  // Authentication check
  useEffect(() => {
    fetch("/api/auth/verify", {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin");
        } else {
          setAuthenticated(true);
          loadBlogs();
        }
      })
      .finally(() => setLoading(false));
  }, [router, loadBlogs]);

  // Handle blog selection
  const handleBlogSelect = (id: string) => {
    setSelectedBlogId(id);
    if (id) {
      loadBlog(id);
    } else {
      // Yeni blog oluştur
      setForm({
        id: "",
        title: "",
        excerpt: "",
        content: "",
        image: "",
        date: new Date().toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        author: "Loegs",
        category: "NEWS",
        readTime: "5 dk",
        published: false,
        tags: "",
      });
    }
  };

  // Handle form field changes
  const updateField = (field: keyof BlogFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        updateField("image", data.url);
      } else {
        throw new Error("No URL returned");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      // Fetch current blog data
      const res = await fetch("/api/content/blog");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const blogData = await res.json();
      
      let updatedPosts: BlogPost[] = [];
      
      if (form.id) {
        // Update existing blog
        updatedPosts = blogs.map((blog) =>
          blog.id === form.id
            ? {
                ...blog,
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                image: form.image,
                date: form.date,
                author: form.author,
                category: form.category,
                readTime: form.readTime,
                published: form.published,
                tags: form.tags,
              }
            : blog
        );
      } else {
        // Create new blog
        const newBlog: BlogPost = {
          id: Date.now().toString(),
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          image: form.image,
          date: form.date,
          author: form.author,
          category: form.category,
          readTime: form.readTime,
          published: form.published,
          tags: form.tags,
        };
        updatedPosts = [...blogs, newBlog];
        setForm((prev) => ({ ...prev, id: newBlog.id }));
        setSelectedBlogId(newBlog.id);
      }

      // Save updated blog data
      const saveRes = await fetch("/api/content/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...blogData,
          posts: updatedPosts,
        }),
        credentials: "include",
        cache: "no-store",
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save blog");
      }

      setSaveMessage({ type: "success", text: "Blog başarıyla kaydedildi!" });
      
      // Mesajı 3 saniye sonra kaldır
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);

      // Blog listesini yenile
      await loadBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      setSaveMessage({ type: "error", text: "Kaydetme sırasında bir hata oluştu." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center">
        <StarsCanvas />
        <div className="text-slate-900 dark:text-white text-xl backdrop-blur-md bg-white/90 dark:bg-transparent px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 animate-pulse transition-colors duration-500">
          Yükleniyor...
        </div>
      </div>
    );
  }

  // Blog Thumbnail Card Component
  const BlogThumbnailCard = ({
    blog,
    isSelected,
    onSelect,
    onImageChange,
  }: {
    blog: BlogPost;
    isSelected: boolean;
    onSelect: () => void;
    onImageChange: (file: File) => Promise<void>;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading, setImageUploading] = useState(false);

    const handleImageClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Lütfen bir resim dosyası seçin!");
        return;
      }

      setImageUploading(true);
      try {
        await onImageChange(file);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
          isSelected
            ? "ring-4 ring-blue-500 dark:ring-blue-400 ring-offset-2 dark:ring-offset-slate-800 shadow-2xl shadow-blue-500/30 dark:shadow-blue-400/20"
            : "shadow-lg hover:shadow-xl"
        }`}
        onClick={onSelect}
      >
        {/* Gradient Background Container */}
        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-900/90 border border-slate-200/50 dark:border-white/10 overflow-hidden">
          {/* Kapak Fotoğrafı */}
          <div className="relative aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
            {blog.image ? (
              <>
                <Image
                  src={blog.image}
                  alt={blog.title || "Blog kapak"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-white/30 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                <FiCamera className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-xs font-medium">Kapak Fotoğrafı Yok</span>
              </div>
            )}
            
            {/* Seçili İndikator */}
            {isSelected && (
              <div className="absolute top-2 right-2 z-20">
                <div className="w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
          )}

            {/* Fotoğraf Değiştirme Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick();
              }}
            >
              <button
                className="px-5 py-2.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-900 dark:text-white rounded-xl text-sm font-semibold hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 flex items-center gap-2 shadow-xl hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick();
                }}
                disabled={imageUploading}
              >
                {imageUploading ? (
                  <><FiClock className="w-4 h-4 animate-spin" /> Yükleniyor...</>
                ) : (
                  <><FiCamera className="w-4 h-4" /> Fotoğraf Değiştir</>
                )}
              </button>
            </div>

            {/* Gizli File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Blog Bilgileri - Daha Güzel Tasarım */}
          <div className="p-3 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-t border-slate-200/50 dark:border-white/5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 flex-1 leading-tight">
                {blog.title || "Başlıksız Blog"}
              </h3>
              {isSelected && (
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-slate-500 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[10px] font-medium text-slate-500 dark:text-white/60">
                  {blog.date || "Tarih yok"}
                </p>
              </div>
              
              {blog.published ? (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-full border border-green-200 dark:border-green-500/30">
                  <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mr-1.5"></span>
                  Yayında
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full border border-yellow-200 dark:border-yellow-500/30">
                  <span className="w-1.5 h-1.5 bg-yellow-500 dark:bg-yellow-400 rounded-full mr-1.5"></span>
                  Taslak
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center relative z-[100]">
      <StarsCanvas />
      <div className="max-w-[1920px] mx-auto p-4 md:p-6 relative z-[101]">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white dark:bg-transparent rounded-xl p-4 mb-6 border border-slate-200 dark:border-white/20 shadow-2xl transition-colors duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">
                Blog Editörü
              </h1>
              <p className="text-slate-600 dark:text-white/60 text-xs transition-colors duration-500">
                Blog yazılarınızı canlı önizleyerek düzenleyin
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-200 active:scale-95"
              >
                Geri Dön
              </button>
            </div>
          </div>
        </div>

        {/* Blog Seçimi ve Kaydet Butonu */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-900/95 rounded-xl p-5 mb-6 border border-slate-200/50 dark:border-white/10 shadow-lg transition-colors duration-500">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full">
              <label className="block text-slate-900 dark:text-white mb-3 font-bold text-sm transition-colors duration-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Blog Seç
              </label>
              <div className="relative">
                <select
                  value={selectedBlogId}
                  onChange={(e) => handleBlogSelect(e.target.value)}
                  className="blog-select-dropdown w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-white/20 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 transition-all duration-300 font-medium appearance-none cursor-pointer shadow-sm hover:shadow-md"
                  style={{
                    color: 'rgb(15, 23, 42)',
                  }}
                >
                  <option value="" style={{ color: 'rgb(15, 23, 42)', backgroundColor: 'white' }}>
                    Yeni Blog Yazısı
                  </option>
                  {blogs.map((blog) => (
                    <option 
                      key={blog.id} 
                      value={blog.id}
                      style={{ color: 'rgb(15, 23, 42)', backgroundColor: 'white' }}
                    >
                      {blog.title || `Blog ${blog.id}`}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-500 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white/20 backdrop-blur-md border border-slate-900 dark:border-white/30 text-white dark:text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg"
              >
                {saving ? (
                  <>
                    <FiClock className="inline w-4 h-4 mr-2 animate-spin" /> Kaydediliyor...
                  </>
                ) : (
                  <>
                    <FiSave className="inline w-4 h-4 mr-2" /> Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Save Message */}
          {saveMessage && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                saveMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30"
                  : "bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30"
              } transition-colors duration-500`}
            >
              {saveMessage.text}
            </div>
          )}
        </div>

        {/* Blog Listesi - Küçük Kapak Fotoğrafları - Yeniden Tasarlandı */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-900/95 rounded-2xl p-6 mb-6 border border-slate-200/50 dark:border-white/10 shadow-2xl transition-colors duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-500 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <FiBookOpen className="w-5 h-5 text-white" />
              </div>
              <span>Blog Listesi - Kapak Fotoğrafları</span>
            </h2>
            <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <span className="text-sm font-semibold text-slate-700 dark:text-white">
                {blogs.length} {blogs.length === 1 ? 'Blog' : 'Blog'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {blogs.map((blog) => (
              <BlogThumbnailCard
                key={blog.id}
                blog={blog}
                isSelected={selectedBlogId === blog.id}
                onSelect={() => handleBlogSelect(blog.id)}
                onImageChange={async (file: File) => {
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("folder", "blog");

                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                      credentials: "include",
                    });

                    if (!res.ok) throw new Error("Upload failed");

                    const data = await res.json();
                    if (data.url) {
                      // Update blog image
                      const updatedBlogs = blogs.map((b) =>
                        b.id === blog.id ? { ...b, image: data.url } : b
                      );
                      
                      // Save to backend
                      const blogDataRes = await fetch("/api/content/blog");
                      const blogData = await blogDataRes.json();
                      
                      await fetch("/api/content/blog", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          ...blogData,
                          posts: updatedBlogs,
                        }),
                        credentials: "include",
                        cache: "no-store",
                      });
                      
                      // Refresh blogs list
                      await loadBlogs();
                      
                      // If this is the selected blog, update form too
                      if (selectedBlogId === blog.id) {
                        updateField("image", data.url);
                      }
                    }
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    alert("Fotoğraf yükleme hatası!");
                  }
                }}
              />
            ))}
            {/* Yeni Blog Ekle Butonu - Daha Güzel Tasarım */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedBlogId("");
                setForm({
                  id: "",
                  title: "",
                  excerpt: "",
                  content: "",
                  image: "",
                  date: new Date().toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                  author: "Loegs",
                  category: "NEWS",
                  readTime: "5 dk",
                  published: false,
                  tags: "",
                });
              }}
              className="relative flex flex-col items-center justify-center aspect-[4/5] border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <FiPlus className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Yeni Blog
                </span>
                <span className="text-xs text-slate-500 dark:text-white/50 mt-1">
                  Ekle
                </span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Canlı Önizleme - Ortada */}
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/20 shadow-2xl transition-colors duration-500 h-[calc(100vh-280px)] bg-white dark:bg-transparent">
          <EditableBlogPreview
            title={form.title}
            excerpt={form.excerpt}
            content={form.content}
            image={form.image}
            date={form.date}
            author={form.author}
            category={form.category}
            readTime={form.readTime}
            published={form.published}
            tags={form.tags}
            onTitleChange={(value) => updateField("title", value)}
            onExcerptChange={(value) => updateField("excerpt", value)}
            onContentChange={(value) => updateField("content", value)}
            onImageChange={handleImageUpload}
            onCategoryChange={(value) => updateField("category", value)}
            onPublishedChange={(value) => updateField("published", value)}
            onTagsChange={(value) => updateField("tags", value)}
          />
        </div>
      </div>
    </div>
  );
}


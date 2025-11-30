"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      <div
        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
          isSelected
            ? "border-slate-900 dark:border-white shadow-lg scale-105"
            : "border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/40"
        }`}
        onClick={onSelect}
      >
        {/* Kapak Fotoğrafı */}
        <div className="relative aspect-[3/4] bg-slate-100 dark:bg-white/5 overflow-hidden">
          {blog.image ? (
            <Image
              src={blog.image}
              alt={blog.title || "Blog kapak"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-white/30">
              <FiCamera className="w-12 h-12" />
            </div>
          )}
          
          {/* Fotoğraf Değiştirme Overlay */}
          <div
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick();
            }}
          >
            <button
              className="px-4 py-2 bg-white dark:bg-white/20 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick();
              }}
              disabled={imageUploading}
            >
              {imageUploading ? (
                <><FiClock className="inline w-4 h-4 mr-2 animate-spin" /> Yükleniyor...</>
              ) : (
                <><FiCamera className="inline w-4 h-4 mr-2" /> Fotoğraf Değiştir</>
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

        {/* Blog Bilgileri */}
        <div className="p-2 bg-white dark:bg-white/5">
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1">
            {blog.title || "Başlıksız"}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-white/50">
            {blog.date || "Tarih yok"}
          </p>
          {blog.published ? (
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded">
              Yayında
            </span>
          ) : (
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded">
              Taslak
            </span>
          )}
        </div>
      </div>
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
        <div className="backdrop-blur-xl bg-white dark:bg-transparent rounded-xl p-4 mb-6 border border-slate-200 dark:border-white/20 shadow-lg transition-colors duration-500">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full">
              <label className="block text-slate-900 dark:text-white/90 mb-2 font-semibold text-sm transition-colors duration-500">
                Blog Seç
              </label>
              <select
                value={selectedBlogId}
                onChange={(e) => handleBlogSelect(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-white/5 border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
              >
                <option value="">Yeni Blog Yazısı</option>
                {blogs.map((blog) => (
                  <option key={blog.id} value={blog.id}>
                    {blog.title || `Blog ${blog.id}`}
                  </option>
                ))}
              </select>
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

        {/* Blog Listesi - Küçük Kapak Fotoğrafları */}
        <div className="backdrop-blur-xl bg-white dark:bg-transparent rounded-xl p-4 mb-6 border border-slate-200 dark:border-white/20 shadow-lg transition-colors duration-500">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 transition-colors duration-500 flex items-center gap-2">
            <FiBookOpen className="w-5 h-5" />
            Blog Listesi - Kapak Fotoğrafları
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
            {/* Yeni Blog Ekle Butonu */}
            <button
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
              className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-lg hover:border-slate-400 dark:hover:border-white/40 transition-all duration-200 bg-white dark:bg-white/5"
            >
              <FiPlus className="w-10 h-10 mb-2 text-slate-600 dark:text-white/60" />
              <span className="text-sm font-medium text-slate-600 dark:text-white/60">
                Yeni Blog
              </span>
            </button>
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


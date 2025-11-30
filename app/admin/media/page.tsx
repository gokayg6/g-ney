"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StarsCanvas from "@/components/main/StarsBackground";

interface MediaFile {
  url: string;
  name: string;
  size?: number;
  type?: string;
}

export default function MediaLibrary() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "images" | "documents">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery", {
        credentials: "include",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const fileList: MediaFile[] = (data.images || []).map((url: string) => {
          const parts = url.split("/");
          const name = parts[parts.length - 1];
          return { url, name };
        });
        setFiles(fileList);
      }
    } catch (error) {
      console.error("Error loading files:", error);
    }
  }, []);

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
          loadFiles();
        }
      })
      .finally(() => setLoading(false));
  }, [router, loadFiles]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(fileList).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "uploads");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!res.ok) throw new Error("Upload failed");
        return res.json();
      });

      await Promise.all(uploadPromises);
      await loadFiles();
      alert("Dosyalar başarıyla yüklendi!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Dosya yükleme hatası!");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch("/api/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        credentials: "include",
      });

      if (res.ok) {
        await loadFiles();
        alert("Dosya silindi!");
      } else {
        alert("Silme işlemi başarısız!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Silme işlemi sırasında hata oluştu!");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    if (!confirm(`${selectedFiles.size} dosyayı silmek istediğinize emin misiniz?`)) return;

    try {
      const deletePromises = Array.from(selectedFiles).map((url) =>
        fetch("/api/media/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          credentials: "include",
        })
      );

      await Promise.all(deletePromises);
      setSelectedFiles(new Set());
      await loadFiles();
      alert("Dosyalar silindi!");
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Silme işlemi sırasında hata oluştu!");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL kopyalandı!");
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
    const matchesFilter =
      filter === "all" || (filter === "images" && isImage) || (filter === "documents" && !isImage);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center">
        <StarsCanvas />
        <div className="text-slate-900 dark:text-white text-xl backdrop-blur-md bg-white/90 dark:bg-transparent px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 animate-pulse">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center relative z-[100]">
      <StarsCanvas />
      <div className="container mx-auto px-4 py-8 relative z-[101]">
        <div className="backdrop-blur-xl bg-white/90 dark:bg-white/10 rounded-2xl p-6 border border-slate-200 dark:border-white/20 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Medya Kütüphanesi
              </h1>
              <p className="text-slate-600 dark:text-gray-300">
                Tüm dosyalarınızı yönetin ve organize edin
              </p>
            </div>
            <div className="flex gap-2">
              <label className="px-4 py-2 bg-slate-900 dark:bg-white/10 text-white rounded-xl cursor-pointer hover:bg-slate-800 dark:hover:bg-white/20 transition-colors">
                {uploading ? "Yükleniyor..." : "📁 Dosya Yükle"}
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <label className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                📷 Cihazdan Seç
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {selectedFiles.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Seçilenleri Sil ({selectedFiles.size})
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Dosya ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  filter === "all"
                    ? "bg-slate-900 dark:bg-white/20 text-white"
                    : "bg-white dark:bg-white/10 text-slate-700 dark:text-gray-300"
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilter("images")}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  filter === "images"
                    ? "bg-slate-900 dark:bg-white/20 text-white"
                    : "bg-white dark:bg-white/10 text-slate-700 dark:text-gray-300"
                }`}
              >
                Resimler
              </button>
              <button
                onClick={() => setFilter("documents")}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  filter === "documents"
                    ? "bg-slate-900 dark:bg-white/20 text-white"
                    : "bg-white dark:bg-white/10 text-slate-700 dark:text-gray-300"
                }`}
              >
                Belgeler
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-900 dark:bg-white/20 text-white"
                    : "bg-white dark:bg-white/10 text-slate-700 dark:text-gray-300"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  viewMode === "list"
                    ? "bg-slate-900 dark:bg-white/20 text-white"
                    : "bg-white dark:bg-white/10 text-slate-700 dark:text-gray-300"
                }`}
              >
                Liste
              </button>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-slate-600 dark:text-gray-400">
              {searchQuery ? "Arama sonucu bulunamadı" : "Henüz dosya yüklenmemiş"}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  : "space-y-2"
              }
            >
              {filteredFiles.map((file) => {
                const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
                const isSelected = selectedFiles.has(file.url);

                return (
                  <div
                    key={file.url}
                    className={`relative group border-2 rounded-xl overflow-hidden transition-all ${
                      isSelected
                        ? "border-blue-500"
                        : "border-slate-200 dark:border-white/20"
                    } ${viewMode === "list" ? "flex items-center gap-4 p-4" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const newSet = new Set(selectedFiles);
                        if (e.target.checked) {
                          newSet.add(file.url);
                        } else {
                          newSet.delete(file.url);
                        }
                        setSelectedFiles(newSet);
                      }}
                      className="absolute top-2 left-2 z-10 w-5 h-5"
                    />
                    {isImage ? (
                      <div className={`${viewMode === "list" ? "w-24 h-24 flex-shrink-0" : "aspect-square"} relative`}>
                        <Image
                          src={file.url}
                          alt={file.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        />
                      </div>
                    ) : (
                      <div className={`${viewMode === "list" ? "w-24 h-24 flex-shrink-0" : "aspect-square"} flex items-center justify-center bg-slate-100 dark:bg-white/5`}>
                        <span className="text-4xl">📄</span>
                      </div>
                    )}
                    <div className={`${viewMode === "list" ? "flex-1" : "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2"}`}>
                      <p className={`text-white text-xs text-center truncate w-full ${viewMode === "list" ? "text-slate-900 dark:text-white" : ""}`}>
                        {file.name}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Kopyala
                        </button>
                        <button
                          onClick={() => handleDelete(file.url)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "section" | "project" | "blog" | "service";
  title: string;
  description: string;
  url: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data || !query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];

    // Search projects
    if (data.projects?.items) {
      data.projects.items.forEach((project: any) => {
        if (
          project.title?.toLowerCase().includes(query.toLowerCase()) ||
          project.description?.toLowerCase().includes(query.toLowerCase())
        ) {
          searchResults.push({
            type: "project",
            title: project.title,
            description: project.description,
            url: "/projects",
          });
        }
      });
    }

    // Search blog posts
    if (data.blog?.posts) {
      data.blog.posts.forEach((post: any) => {
        if (
          post.title?.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(query.toLowerCase())
        ) {
          searchResults.push({
            type: "blog",
            title: post.title,
            description: post.excerpt,
            url: `/blog/${post.id}`,
          });
        }
      });
    }

    // Search services
    if (data.services?.items) {
      data.services.items.forEach((service: any) => {
        if (
          service.title?.toLowerCase().includes(query.toLowerCase()) ||
          service.description?.toLowerCase().includes(query.toLowerCase())
        ) {
          searchResults.push({
            type: "service",
            title: service.title,
            description: service.description,
            url: "/#services",
          });
        }
      });
    }

    setResults(searchResults.slice(0, 5));
  }, [query, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
    if (e.key === "Enter" && results.length > 0) {
      router.push(results[0].url);
      setIsOpen(false);
      setQuery("");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return "Project";
      case "blog":
        return "Blog";
      case "service":
        return "Service";
      default:
        return "";
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
      >
        <span className="hidden md:inline">Ara</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50">
          <div className="p-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Arama yapın..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              autoFocus
            />
          </div>

          {query && (
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  Sonuç bulunamadı
                </div>
              ) : (
                <div className="p-2">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        router.push(result.url);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-colors flex items-start gap-3"
                    >
                      <span className="text-xs text-gray-400 uppercase font-semibold">{getTypeIcon(result.type)}</span>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{result.title}</div>
                        <div className="text-gray-400 text-sm line-clamp-2">
                          {result.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


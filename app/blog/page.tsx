"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import type { BlogPost, BlogData } from "@/lib/data";

// Backend'deki posts ile TAMAMEN AYNI - hiçbir değişiklik yok
// Backend'den gelen posts direkt burada kullanılıyor
const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "mustafa hocam",
    excerpt: "Bugün üretim masasını yeni kokumuz Camomile Tea & French Lavender için hazırladım. Lavanta demetleri stüdyoyu sakinleştiriyor.",
    content: "06:30 — Atölyeye girdiğimde lavanta demetleri hâlâ gece lambalarının altında parlıyordu. Camomile yapraklarını öğütürken çıkan ses, sabah sessizliğine eşlik etti.\n\n12:10 — İlk deneme partisini hazırladım. Renk tam istediğim gibi pastel krem oldu. Ekibin geri bildirimi \"şifa gibi\" oldu.\n\n19:45 — Etiket taslağını güncelledim. Camomile illüstrasyonunu bir tık yumuşattım. Yarın fotoğraf çekimi var, enerjimiz yüksek.",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=2400&q=80",
    date: "20 Ocak 2024",
    author: "Loegs",
    category: "journal",
    readTime: "4 dk",
    published: true,
  },
  {
    id: "2",
    title: "Stüdyodan Günlük: %25 İndirim Hazırlığı",
    excerpt: "Black Friday için etiketleri bastık, paketleri katladık, kahvelerimizi tazeledik. Bu yıl 100.000 ağaç hedefine herkes hazır.",
    content: "09:00 — Kampanya planını son kez gözden geçirdik. Her sipariş için ağaç dikim kartlarını paketlere ekleyeceğiz.\n\n13:30 — Depoda hummalı bir hazırlık vardı. Yeni kutularımızı test ettik, bantları güçlendirdik.\n\n21:15 — Kampanya sayfasını yeniden yazdım. Bir arkadaşına anlatır gibi... çünkü gerçekten öyle.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2400&q=80",
    date: "18 Ocak 2024",
    author: "Loegs",
    category: "campaign",
    readTime: "3 dk",
    published: true,
  },
  {
    id: "3",
    title: "Retro Swirl Kutusu ve İlham Panosu",
    excerpt: "Bugün Retro Swirl için 70'ler posterleri, neon renkler ve eski dergilerle dolu bir masa kurdum.",
    content: "09:15 — Eski plaklarımızı dinleyerek işe başladım. Mor ve turuncu tonların bir arada ne kadar sıcak durduğunu tekrar hatırladım.\n\n14:00 — Fotoğraf çekimi yaptık. Kutunun üzerine sinen ışık, ekibin moralini yükseltti.\n\n17:30 — Blog yazısını bitirdim; Retro Swirl'ün hikâyesini yazarken çocukluğumdan kalan defterleri bile karıştırdım.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=2400&q=80",
    date: "15 Ocak 2024",
    author: "Loegs",
    category: "design",
    readTime: "5 dk",
    published: true,
  },
  {
    id: "4",
    title: "Atölyede Genç Misafir: Çocuklar ve Doğal Formüller",
    excerpt: "Küçük kuzenim Ada bugün atölyeye geldi, deodorant yapımını adım adım anlattım. Çocuklar için doğal seçimlerin notlarını aldım.",
    content: "10:05 — Ada ile birlikte laboratuvar önlüğü giydik. Malzemeleri tek tek kokladı, en çok shea yağını sevdi.\n\n14:20 — Çocuklar için neden alüminyum içermeyen formül kullandığımızı anlattım. Ada, \"Bu çok mantıklı\" deyip defterine not aldı.\n\n18:40 — Blog yazısını Ada'nın sorularıyla şekillendirdim. Çocukların merakı gerçekten bize yön veriyor.",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=2400&q=80",
    date: "12 Ocak 2024",
    author: "Loegs",
    category: "lifestyle",
    readTime: "4 dk",
    published: true,
  },
  {
    id: "5",
    title: "Sabah Raporu: Espresso, Playlist ve Tedarik Listesi",
    excerpt: "Haftanın ilk siparişlerini hazırlarken kahve lekeli tedarik listeleri ve lo-fi çalma listesi masamdaydı.",
    content: "07:20 — Espresso makinesi sesine karışan kesme tahtası vuruşları. Yeni kavanoz kapakları için tedarik listesini güncelledim.\n\n11:50 — Lo-fi çalma listemiz, paketleme temposunu koruyor. Çıkışa hazır 84 sipariş var.\n\n16:10 — Depo listelerini Notion'a aktardım. Eksik kalan yalnızca pamuk kurdele.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2400&q=80",
    date: "9 Ocak 2024",
    author: "Loegs",
    category: "studio",
    readTime: "3 dk",
    published: true,
  },
  {
    id: "6",
    title: "Kutu Tasarımında Dokulu Kağıt Denemeleri",
    excerpt: "Yeni koleksiyon için pamuk dokulu kağıtları kalın vernikle buluşturduk. Test masasında güzel sürprizler oldu.",
    content: "08:45 — Pamuk dokulu kağıtları keserken makas sesi bile terapi oldu.\n\n13:05 — Kalın vernik ilk katında hafif kabarcık yaptı; sıcak hava tabancasıyla düzelttim.\n\n20:00 — Nihai kutu numunesini raflara yerleştirdim. Işığa göre renk değiştirmesi tam istediğimiz gibi.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=2400&q=80",
    date: "7 Ocak 2024",
    author: "Loegs",
    category: "design",
    readTime: "4 dk",
    published: true,
  },
  {
    id: "7",
    title: "Küçük Paketleme Ritüeli",
    excerpt: "Her paket çıkmadan önce kurdelelerin eşit olduğuna üç kez bakıyorum. Bugün taktığım krem kurdeleler tam iOS butonları gibi pürüzsüz.",
    content: "09:40 — Kurdele uzunluklarını lazer kesiciyle eşitledik. Artık milim sapma yok.\n\n15:25 — Paketlerin üzerine isim yazarken Apple Pencil kullanıyorum; yazı daha akıcı.\n\n22:10 — Yola çıkacak son paket için çalma listemizin en sakin parçasını seçtim.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80",
    date: "5 Ocak 2024",
    author: "Loegs",
    category: "studio",
    readTime: "3 dk",
    published: true,
  },
  {
    id: "8",
    title: "Kod ve Koku: Ürün Sayfası Güncellemesi",
    excerpt: "Ürün sayfasına yeni animasyonlar ekledim. Kod yazarken arka planda yeni mum koleksiyonumuz yanıyordu.",
    content: "10:00 — Hero bölümüne iOS tarzı scale animasyonu ekledim.\n\n14:40 — Yeni fotoğrafları optimize ederken sandalwood mum masamda yandı. Tarayıcı testleri mis gibi kokuyor.\n\n18:30 — Deploy öncesi QA turunu tamamladım. Artık ürün sayfası daha akışkan.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2400&q=80",
    date: "3 Ocak 2024",
    author: "Loegs",
    category: "development",
    readTime: "4 dk",
    published: true,
  },
  {
    id: "9",
    title: "Hafta Sonu Pop-up Güncesi",
    excerpt: "Cumartesi pop-up standımızda 48 kişiyle sohbet ettik. Not defterim ilham dolu cümlelerle kaplandı.",
    content: "07:50 — Stand kurulumunu tamamladık, tüm ürünler hizalandı.\n\n12:30 — Ziyaretçilerin soruları not defterimi doldurdu: \"Bu kokuyu hangi şehirden ilham aldınız?\"\n\n21:00 — Defteri karıştırırken yeni koleksiyon fikri çıktı. Pop-up'lar her seferinde sürpriz getiriyor.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=2400&q=80",
    date: "30 Aralık 2023",
    author: "Loegs",
    category: "journal",
    readTime: "4 dk",
    published: true,
  },
  {
    id: "10",
    title: "Gece Vardiyası ve Mumlar",
    excerpt: "Stüdyoda gece vardiyası yaparken playlist ve mumlar eşlik etti. Kod satırlarıyla kokular aynı ritimde ilerledi.",
    content: "23:15 — Gece vardiyasına açık gri hoodie ile başladım. Lo-fi beats yumuşak gidiyor.\n\n01:40 — Mobil optimizasyonu bitirdim, kartlardaki animasyonlar iOS hissi veriyor.\n\n03:05 — Mum tamamen eridiğinde build tamamlandı. Gece vardiyası hedefi: başarı.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2400&q=80",
    date: "28 Aralık 2023",
    author: "Loegs",
    category: "nightshift",
    readTime: "5 dk",
    published: true,
  },
];

const defaultMeta = {
  title: "Blog",
  subtitle: "BURADAYIZ",
  introTitle: "Atölyeden Günlük Notlar",
  introDescription:
    "Her sabahın kokusunu, öğle arasında karalanan fikirleri ve gecenin sessizliğinde biten işleri burada topluyorum. Bu sayfa; üretim masasından sesler, yeni kokular, küçük aksaklıklar ve beklenmedik ilhamların günlük gibi kaydedildiği bir yer.",
};

export default function BlogPage() {
  // State'leri kaldırdık, direkt sabit değerler kullanılıyor
  const posts = fallbackPosts;
  const meta = defaultMeta;
  
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

  // API çağrısı TAMAMEN KALDIRILDI - hiçbir veri güncellenmiyor

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
      <div>
        <PageHero
          title={meta.title}
          subtitle={meta.subtitle}
          description={`${meta.introTitle}\n\n${meta.introDescription}`}
          showLogo={true}
        />
      </div>

      {/* BLOG GRID */}
      <section className="px-3 sm:px-4 md:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
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
                  <div className="blog-card-text-content absolute inset-0 flex flex-col justify-end sm:justify-center items-center p-3 sm:p-4 md:p-5 lg:p-6 pointer-events-none z-10 sm:group-hover:opacity-0 sm:group-hover:pointer-events-none transition-opacity duration-300">
                    <div className="w-full sm:w-auto text-center transform translate-y-3 sm:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-white text-sm sm:text-base md:text-lg font-semibold mb-2 line-clamp-2 drop-shadow-xl">
                        {post.title}
                      </h4>
                      <p className="hidden sm:block text-white/90 text-xs md:text-sm leading-relaxed line-clamp-2 mb-3 drop-shadow-lg">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* DETAYLARI GÖR BUTONU - Modern tasarım */}
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
                    className="view-details-btn absolute z-[100000] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 md:px-4.5 md:py-2 rounded-full text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider text-white bg-white/10 dark:bg-white/8 backdrop-blur-md border border-white/30 dark:border-white/35 shadow-[0_8px_32px_rgba(255,255,255,0.15)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.2)] min-w-[110px] sm:min-w-[125px] md:min-w-[135px] transition-all duration-300 ease-out"
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
                      transformOrigin: "center center",
                    }}
                  >
                    <span className="whitespace-nowrap font-extrabold drop-shadow-sm">Detayları Gör</span>
                    <svg
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 flex-shrink-0 transition-transform duration-300 drop-shadow-sm ${
                        expandedPostId === post.id ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
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
      </section>

      <div>
        <Footer />
      </div>
    </main>
  );
}

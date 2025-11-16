"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PortfolioData } from '@/lib/data';
import StarsCanvas from '@/components/main/StarsBackground';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PortfolioData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verify authentication
    fetch('/api/auth/verify')
      .then(res => res.json())
      .then(authData => {
        if (!authData.authenticated) {
          router.push('/admin');
        } else {
          setAuthenticated(true);
          loadData();
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content');
      const content = await res.json();
      setData(content);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center">
        <StarsCanvas />
        <div className="text-white text-xl backdrop-blur-md bg-white/10 px-6 py-3 rounded-xl border border-white/20 animate-pulse">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!authenticated || !data) {
    return null;
  }

  const sections = [
    { href: '/admin/edit/hero', title: 'Hero Section', desc: 'Ana sayfa hero içeriğini düzenle', icon: '🚀' },
    { href: '/admin/edit/about', title: 'Hakkımda', desc: 'Hakkımda bölümünü düzenle', icon: '👤' },
    { href: '/admin/edit/experience', title: 'Deneyim', desc: 'İş deneyimlerini yönet', icon: '💼' },
    { href: '/admin/edit/projects', title: 'Projeler', desc: 'Projeleri ve şablonları yönet', icon: '🎨' },
    { href: '/admin/edit/subdomainProjects', title: 'Subdomain Projeleri', desc: 'Subdomain projelerini ve görsellerini yönet', icon: '🌐' },
    { href: '/admin/edit/blog', title: 'Blog', desc: 'Blog yazılarını yönet', icon: '📝' },
    { href: '/admin/edit/contact', title: 'İletişim', desc: 'İletişim bilgilerini düzenle', icon: '📧' },
    { href: '/admin/edit/social', title: 'Sosyal Medya', desc: 'Sosyal medya linklerini düzenle', icon: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center p-4 md:p-8 relative z-[100]">
      <StarsCanvas />
      <div className="max-w-7xl mx-auto relative z-[101]">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 mb-6 border border-white/20 shadow-2xl animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-xs">Portfolyo içeriğinizi yönetin</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 active:scale-95"
              >
                Siteyi Görüntüle
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all duration-200 active:scale-95"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Link
              key={section.href}
              href={section.href}
              className="group backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                {section.title}
              </h2>
              <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                {section.desc}
              </p>
              <div className="mt-4 text-white/40 group-hover:text-white/60 transition-colors text-xs">
                Düzenlemek için tıklayın →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


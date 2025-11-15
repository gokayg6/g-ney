"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StarsCanvas from '@/components/main/StarsBackground';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/auth/verify')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          router.push('/admin/dashboard');
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting login...', { email, hasPassword: !!password });
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log('Login response:', { status: res.status, data });

      if (res.ok) {
        // Wait a bit for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Giriş başarısız. Email ve şifrenizi kontrol edin.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center px-4 relative z-[100]">
      <StarsCanvas />
      <div className="w-full max-w-md relative z-[101] animate-fade-in">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl relative z-[102] animate-scale-in">
          <h1 className="text-white text-3xl font-semibold mb-6 text-center animate-slide-down">
            Admin Girişi
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4" style={{ position: 'relative', zIndex: 103 }}>
            <div className="animate-slide-up" style={{ position: 'relative', zIndex: 104, animationDelay: '0.1s', animationFillMode: 'both' }}>
              <label className="block text-gray-200 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                required
                autoComplete="email"
                placeholder="email@example.com"
                style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
              />
            </div>
            <div className="animate-slide-up" style={{ position: 'relative', zIndex: 104, animationDelay: '0.2s', animationFillMode: 'both' }}>
              <label className="block text-gray-200 mb-2 font-medium">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm animate-shake bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 disabled:opacity-50 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-500/30 animate-slide-up"
              style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto', animationDelay: '0.3s' }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


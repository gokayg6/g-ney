"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { PortfolioData, HeroData, AboutData, ExperienceData, ProjectsData, ContactData, SocialIcon, ExperienceItem, ProjectItem, BlogPost } from '@/lib/data';
import { SubdomainProject } from '@/lib/subdomain-data';
import StarsCanvas from '@/components/main/StarsBackground';
import { FiTrash2, FiImage, FiCamera, FiMail, FiPhone, FiSmartphone, FiShoppingCart, FiGamepad2, FiBriefcase, FiUsers, FiRocket } from 'react-icons/fi';

export default function EditSection() {
  const router = useRouter();
  const params = useParams();
  const section = params.section as string;
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [allSubdomainProjects, setAllSubdomainProjects] = useState<SubdomainProject[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryCallback, setGalleryCallback] = useState<((url: string) => void) | null>(null);

  const loadData = useCallback(async () => {
    try {
      // Force no cache with multiple strategies for production
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const random2 = Math.random().toString(36).substring(7);
      // Use section-specific endpoint for better cache busting
      const url = `/api/content/${section}?t=${timestamp}&r=${random}&r2=${random2}&_=${Date.now()}`;
      const res = await fetch(url, {
        cache: 'no-store',
        next: { revalidate: 0 },
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Request-ID': `${timestamp}-${random}-${random2}`,
          'X-Request-Time': timestamp.toString(),
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      
      const sectionData = await res.json();
      
      // Ensure subdomainProjects is always an array
      if (section === 'subdomainProjects') {
        const projects = Array.isArray(sectionData) ? sectionData : [];
        setData(projects);
        // Store all projects for template cloning
        setAllSubdomainProjects(projects);
      } else if (section === 'social') {
        setData(Array.isArray(sectionData) ? sectionData : []);
      } else {
        setData(sectionData || {});
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Set default values based on section type
      if (section === 'subdomainProjects' || section === 'social') {
        setData([]);
        if (section === 'subdomainProjects') {
          setAllSubdomainProjects([]);
        }
      } else {
        setData({});
      }
    }
  }, [section]);

  useEffect(() => {
    fetch('/api/auth/verify', {
      credentials: 'include',
      cache: 'no-store',
    })
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
  }, [router, section, loadData]);

  // Update allSubdomainProjects when data changes (for template cloning)
  useEffect(() => {
    if (section === 'subdomainProjects' && Array.isArray(data)) {
      setAllSubdomainProjects(data);
    }
  }, [data, section]);

  // Reload data when window gains focus - DISABLED for experience and contact sections to prevent data loss
  useEffect(() => {
    if (section === 'experience' || section === 'contact') return; // Disable auto-reload for experience and contact
    
    const handleFocus = () => {
      if (authenticated) {
        loadData();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [authenticated, section, loadData]);

  // Periodic data refresh every 30 seconds - DISABLED for experience and contact sections to prevent data loss
  useEffect(() => {
    if (!authenticated || section === 'experience' || section === 'contact') return;
    
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [authenticated, section, loadData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
        cache: 'no-store',
      });

      const result = await res.json();

      if (res.ok) {
        // Update allSubdomainProjects if this is subdomainProjects section
        if (section === 'subdomainProjects' && Array.isArray(data)) {
          setAllSubdomainProjects(data);
        }
        alert('Saved successfully!');
        
        // For experience and contact sections, don't reload data - keep current state
        if (section !== 'experience' && section !== 'contact') {
          // Force router refresh and reload data with aggressive cache busting
          router.refresh();
          // Wait a bit for the server to process the save
          await new Promise(resolve => setTimeout(resolve, 200));
          // Reload data with fresh cache-busting
          await loadData();
          // Wait again to ensure data is loaded
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        router.push('/admin/dashboard');
      } else {
        const errorMsg = result.error || 'Unknown error';
        alert(`Failed to save: ${errorMsg}`);
        console.error('Save error:', { status: res.status, error: errorMsg, result });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error saving: ${errorMsg}`);
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    setData((prev: any) => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addItem = (arrayName: string, newItem: any) => {
    if (section === 'subdomainProjects' || section === 'social') {
      // For array sections, data is directly an array
      setData((prev: any) => {
        const currentArray = Array.isArray(prev) ? prev : [];
        return [...currentArray, newItem];
      });
    } else {
      // For object sections, data is an object with arrays inside
      setData((prev: any) => {
        const currentArray = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
        return {
          ...prev,
          [arrayName]: [...currentArray, newItem],
        };
      });
    }
  };

  const updateItem = (arrayName: string, index: number, field: string, value: any) => {
    if (section === 'subdomainProjects' || section === 'social') {
      // For array sections, data is directly an array
      setData((prev: any) => {
        const currentArray = Array.isArray(prev) ? prev : [];
        const newArray = [...currentArray];
        
        // Ensure index exists
        if (!newArray[index]) {
          newArray[index] = {};
        }
        
        // Handle nested fields (e.g., metadata.metaTitle)
        if (field.includes('.')) {
          const keys = field.split('.');
          const newItem = { ...newArray[index] };
          let current: any = newItem;
          
          for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
          }
          
          current[keys[keys.length - 1]] = value;
          newArray[index] = newItem;
        } else {
          newArray[index] = { ...newArray[index], [field]: value };
        }
        
        return newArray;
      });
    } else {
      // For object sections, data is an object with arrays inside (like experience.items)
      setData((prev: any) => {
        if (!prev || typeof prev !== 'object') {
          return prev;
        }
        
        // Create a completely new array to force React re-render
        const currentArray = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
        const newArray = currentArray.map((item: any, idx: number) => {
          if (idx === index) {
            // Update this specific item with new field value
            return {
              ...item,
              [field]: value
            };
          }
          return { ...item }; // Return a copy of unchanged items
        });
        
        // Return completely new object to force React state update
        return {
          ...prev,
          [arrayName]: newArray
        };
      });
    }
  };

  const removeItem = (arrayName: string, index: number) => {
    if (section === 'subdomainProjects' || section === 'social') {
      // For array sections, data is directly an array
      setData((prev: any) => {
        const currentArray = Array.isArray(prev) ? prev : [];
        return currentArray.filter((_: any, i: number) => i !== index);
      });
    } else {
      // For object sections, data is an object with arrays inside
      setData((prev: any) => {
        const currentArray = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
        return {
          ...prev,
          [arrayName]: currentArray.filter((_: any, i: number) => i !== index),
        };
      });
    }
  };

  const loadGalleryImages = async () => {
    try {
      const res = await fetch('/api/gallery', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
      setGalleryImages([]);
    }
  };

  const openGallery = (callback: (url: string) => void) => {
    setGalleryCallback(() => callback);
    setShowGallery(true);
    loadGalleryImages();
  };

  const selectImageFromGallery = (url: string) => {
    if (galleryCallback) {
      galleryCallback(url);
      setShowGallery(false);
      setGalleryCallback(null);
    }
  };

  const handleFileUpload = async (file: File, folder: string = 'uploads'): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      // Refresh gallery after upload
      if (showGallery) {
        loadGalleryImages();
      }
      return result.url;
    } catch (error) {
      console.error('File upload error:', error);
      alert('Dosya yükleme hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
      throw error;
    }
  };

  const handleImageChange = async (arrayName: string, index: number, field: string, file: File | null) => {
    if (!file) return;
    
    try {
      const folder = 'uploads';
      const url = await handleFileUpload(file, folder);
      
      // Update the item with the new image URL
      if (section === 'subdomainProjects' || section === 'social') {
        setData((prev: any) => {
          const currentArray = Array.isArray(prev) ? prev : [];
          const newArray = [...currentArray];
          
          if (!newArray[index]) {
            newArray[index] = {};
          }
          
          // Deep clone to ensure React detects the change
          const updatedItem = { ...newArray[index], [field]: url };
          newArray[index] = updatedItem;
          
          return newArray;
        });
      } else {
        updateItem(arrayName, index, field, url);
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Görsel yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Hardcoded templates - these are always available even if data.json is empty
  const getTemplateProject = (category: string): SubdomainProject | null => {
    const templates: { [key: string]: SubdomainProject } = {
      'mobile-app': {
        id: 'template-app',
        name: 'Biorhythm',
        subdomain: 'app',
        category: 'mobile-app',
        title: 'Biorhythm - Daily Wellness Tracker',
        description: 'Track your physical, emotional, and intellectual biorhythms. Get personalized insights, daily affirmations, and wellness recommendations.',
        tagline: 'Understand yourself better every day',
        logo: '/loegs.png',
        coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
        features: [
          'Daily biorhythm tracking',
          'Personalized wellness insights',
          'AI-powered recommendations',
          'Beautiful visualizations',
          'Daily affirmations',
          'Mood tracking & analysis'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'
        ],
        appStoreLink: 'https://apps.apple.com',
        playStoreLink: 'https://play.google.com',
        techStack: ['React Native', 'TypeScript', 'ML Kit', 'HealthKit'],
        published: true,
        metadata: {
          metaTitle: 'Biorhythm - Daily Wellness Tracker',
          metaDescription: 'Track your biorhythms and get personalized wellness insights',
          keywords: ['wellness', 'biorhythm', 'health', 'meditation']
        }
      },
      'ecommerce': {
        id: 'template-luxestyle',
        name: 'LuxeStyle',
        subdomain: 'luxestyle',
        category: 'ecommerce',
        title: 'LuxeStyle - Premium Fashion Marketplace',
        description: 'Discover and shop the latest premium fashion trends. Curated collections, exclusive deals, and seamless shopping experience.',
        tagline: 'Elevate your style, discover luxury',
        logo: '/loegs.png',
        coverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
        features: [
          'Curated premium collections',
          'AR virtual try-on',
          'One-tap checkout',
          'Personalized recommendations',
          'Exclusive member deals',
          'Fast & free shipping'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80',
          'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80'
        ],
        appStoreLink: '',
        playStoreLink: '',
        techStack: ['React Native', 'Shopify', 'Stripe', 'AR Kit'],
        published: true,
        metadata: {
          metaTitle: 'LuxeStyle - Premium Fashion App',
          metaDescription: 'Shop premium fashion with AR try-on and exclusive deals',
          keywords: ['fashion', 'shopping', 'ecommerce', 'luxury']
        },
        siteLink: ''
      } as any,
      'game': {
        id: 'template-testgame',
        name: 'Shadow Quest',
        subdomain: 'testgame',
        category: 'game',
        title: 'Shadow Quest - Epic Adventure RPG',
        description: 'Embark on an epic journey through mystical realms. Battle fierce enemies, discover ancient secrets, and become the ultimate hero.',
        tagline: 'Your destiny awaits in the shadows',
        logo: '/loegs.png',
        coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
        features: [
          'Stunning 3D graphics',
          'Immersive storyline',
          'Real-time multiplayer battles',
          '100+ unique heroes',
          'Epic boss raids',
          'Guild system & events'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80',
          'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80'
        ],
        appStoreLink: 'https://apps.apple.com',
        playStoreLink: 'https://play.google.com',
        techStack: ['Unity', 'C#', 'Photon', 'Firebase', 'PlayFab'],
        published: true,
        metadata: {
          metaTitle: 'Shadow Quest - Epic Mobile RPG',
          metaDescription: 'Battle through mystical realms in this epic RPG adventure',
          keywords: ['rpg', 'game', 'mobile game', 'multiplayer']
        }
      },
      'saas': {
        id: 'template-saas',
        name: 'SaaS Platform',
        subdomain: 'saas',
        category: 'saas',
        title: 'SaaS Platform - Business Solutions',
        description: 'Powerful SaaS platform designed to streamline your business operations. Manage projects, collaborate with teams, and scale your business with enterprise-grade features.',
        tagline: 'Scale your business with powerful tools',
        logo: '/loegs.png',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
        features: [
          'Cloud-based infrastructure',
          'Real-time collaboration',
          'Advanced analytics & reporting',
          'API integrations',
          'Enterprise security',
          'Scalable architecture'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80'
        ],
        appStoreLink: '',
        playStoreLink: '',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
        published: true,
        metadata: {
          metaTitle: 'SaaS Platform - Business Solutions',
          metaDescription: 'Streamline your business operations with our powerful SaaS platform',
          keywords: ['saas', 'business', 'software', 'enterprise']
        },
        siteLink: ''
      } as any,
      'website': {
        id: 'template-falla',
        name: 'Falla',
        subdomain: 'falla',
        category: 'social',
        title: 'Falla - Social Discovery Platform',
        description: 'Connect with like-minded people, discover new communities, and share your passions. Falla brings people together through shared interests.',
        tagline: 'Discover connections, share passions',
        logo: '/loegs.png',
        coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
        features: [
          'Interest-based matching',
          'Real-time messaging',
          'Community groups',
          'Event discovery',
          'Privacy-first design',
          'Global reach'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80',
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
          'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80',
          'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&q=80'
        ],
        appStoreLink: 'https://apps.apple.com',
        playStoreLink: 'https://play.google.com',
        techStack: ['React Native', 'Firebase', 'GraphQL', 'WebRTC'],
        published: true,
        metadata: {
          metaTitle: 'Falla - Social Discovery Platform',
          metaDescription: 'Connect with people who share your interests and passions',
          keywords: ['social', 'discovery', 'community', 'networking']
        }
      },
      'social': {
        id: 'template-falla',
        name: 'Falla',
        subdomain: 'falla',
        category: 'social',
        title: 'Falla - Social Discovery Platform',
        description: 'Connect with like-minded people, discover new communities, and share your passions. Falla brings people together through shared interests.',
        tagline: 'Find your tribe, share your passion',
        logo: '/loegs.png',
        coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80',
        features: [
          'Interest-based matching',
          'Real-time messaging',
          'Community groups',
          'Event discovery',
          'Privacy-first design',
          'Global reach'
        ],
        screenshots: [
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80',
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
          'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80',
          'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&q=80'
        ],
        appStoreLink: 'https://apps.apple.com',
        playStoreLink: 'https://play.google.com',
        techStack: ['React Native', 'Firebase', 'GraphQL', 'WebRTC'],
        published: true,
        metadata: {
          metaTitle: 'Falla - Social Discovery Platform',
          metaDescription: 'Connect with people who share your interests and passions',
          keywords: ['social', 'discovery', 'community', 'networking']
        }
      }
    };
    
    return templates[category] || templates['mobile-app'];
  };

  // Clone template data when category changes
  const handleCategoryChange = (index: number, newCategory: string) => {
    if (section !== 'subdomainProjects') return;
    
    // Only clone if the project is new (no name or subdomain set)
    const currentData = Array.isArray(data) ? data : [];
    const currentProject = currentData[index];
    
    // If project already has content, just update category
    if (currentProject && (currentProject.name || currentProject.subdomain || currentProject.title)) {
      updateItem('subdomainProjects', index, 'category', newCategory);
      return;
    }
    
    // Get template from hardcoded templates (always available)
    const templateProject = getTemplateProject(newCategory);
    
    if (templateProject) {
      // Clone template data but keep the current project's id, name, subdomain
      setData((prev: any) => {
        const currentArray = Array.isArray(prev) ? prev : [];
        const newArray = [...currentArray];
        
        const existingProject = newArray[index] || {};
        newArray[index] = {
          ...templateProject,
          id: existingProject.id || Date.now().toString(),
          name: existingProject.name || '',
          subdomain: existingProject.subdomain || '',
          category: newCategory as any,
        };
        
        return newArray;
      });
    } else {
      // Just update the category if template not found
      updateItem('subdomainProjects', index, 'category', newCategory);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center">
        <StarsCanvas />
        <div className="text-slate-900 dark:text-white text-xl backdrop-blur-md bg-white/90 dark:bg-white/10 px-6 py-3 rounded-xl border border-slate-200 dark:border-white/20 animate-pulse transition-colors duration-500">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!authenticated || !data) {
    return null;
  }

  const inputStyle = { position: 'relative' as const, zIndex: 105, pointerEvents: 'auto' as const };

  return (
    <div className="min-h-screen bg-[url('/LooperGroup2.png')] bg-no-repeat bg-cover bg-center p-4 md:p-8 relative z-[100]">
      <StarsCanvas />
      <div className="max-w-4xl mx-auto relative z-[101]">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/90 dark:bg-white/10 rounded-xl p-4 mb-4 border border-slate-200 dark:border-white/20 shadow-2xl animate-fade-in transition-colors duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">
                {section.charAt(0).toUpperCase() + section.slice(1)} Düzenle
              </h1>
              <p className="text-slate-600 dark:text-white/60 text-xs transition-colors duration-500">İçeriği düzenleyin ve kaydedin</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-all duration-200 active:scale-95"
                style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 bg-slate-900 dark:bg-white/20 backdrop-blur-md border border-slate-900 dark:border-white/30 text-white dark:text-white rounded-lg text-sm font-semibold hover:bg-slate-800 dark:hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg"
                style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 animate-fade-in transition-colors duration-500" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {section === 'hero' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">İsim</label>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="İsminizi girin"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Tagline</label>
                <input
                  type="text"
                  value={data.tagline || ''}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Tagline'ınızı girin"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Tagline Vurgusu</label>
                <input
                  type="text"
                  value={data.taglineHighlight || ''}
                  onChange={(e) => updateField('taglineHighlight', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Vurgulanacak kelime"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Açıklama</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                  style={inputStyle}
                  rows={4}
                  placeholder="Açıklamanızı girin"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Buton Metni</label>
                <input
                  type="text"
                  value={data.buttonText || ''}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Buton metni"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Buton Linki</label>
                <input
                  type="text"
                  value={data.buttonLink || ''}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          {section === 'about' && (
            <>
              <div>
                <label className="block text-slate-900 dark:text-white/90 mb-2 font-semibold transition-colors duration-500">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                  style={inputStyle}
                  placeholder="Başlık girin"
                />
              </div>
              <div>
                <label className="block text-slate-900 dark:text-white/90 mb-2 font-semibold transition-colors duration-500">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                  style={inputStyle}
                  placeholder="Alt başlık girin"
                />
              </div>
              <div>
                <label className="block text-slate-900 dark:text-white/90 mb-2 font-semibold transition-colors duration-500">Açıklama</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 resize-none font-medium"
                  style={inputStyle}
                  rows={6}
                  placeholder="Açıklama girin"
                />
              </div>
            </>
          )}

          {section === 'experience' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Başlık</label>
                <input
                  type="text"
                  value={data?.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Başlık girin"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Alt Başlık</label>
                <input
                  type="text"
                  value={data?.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık girin"
                />
              </div>
              <div className="border-t border-slate-200 dark:border-[#2E2E2E] pt-6 mt-6 transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Deneyim Öğeleri</h3>
                  <button
                    onClick={() => addItem('items', {
                      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      company: '',
                      companyLogo: '',
                      position: '',
                      period: '',
                      description: '',
                      skills: []
                    })}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    + Yeni Öğe Ekle
                  </button>
                </div>
                {(data?.items || []).map((item: ExperienceItem, index: number) => (
                  <div key={`exp-item-${item.id || index}`} className="bg-white dark:bg-[#111] p-6 rounded-lg mb-4 border-2 border-slate-200 dark:border-[#2E2E2E] shadow-lg dark:shadow-none transition-colors duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Şirket Adı</label>
                        <input
                          type="text"
                          value={item.company || ''}
                          onChange={(e) => updateItem('items', index, 'company', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="Örn: WebHR"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Pozisyon</label>
                        <input
                          type="text"
                          value={item.position || ''}
                          onChange={(e) => updateItem('items', index, 'position', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="Örn: Yazılım Mühendisi"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Dönem</label>
                        <input
                          type="text"
                          value={item.period || ''}
                          onChange={(e) => updateItem('items', index, 'period', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="Örn: Mayıs 2022 - Şimdi"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Şirket Logo (Yol)</label>
                        <input
                          type="text"
                          value={item.companyLogo || ''}
                          onChange={(e) => updateItem('items', index, 'companyLogo', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="Örn: /WebHR.svg"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Açıklama</label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          updateItem('items', index, 'description', newValue);
                        }}
                        className="w-full px-3 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium resize-y"
                        style={inputStyle}
                        rows={8}
                        placeholder="İş deneyiminizi detaylı bir şekilde açıklayın..."
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Yetenekler (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={item.skills?.join(', ') || ''}
                        onChange={(e) => updateItem('items', index, 'skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                        style={inputStyle}
                        placeholder="Örn: React Native, React, JavaScript, TypeScript"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
                            removeItem('items', index);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
                {(!data?.items || data.items.length === 0) && (
                  <div className="text-center py-8 text-slate-500 dark:text-white/50">
                    Henüz deneyim öğesi eklenmemiş. Yukarıdaki butona tıklayarak yeni öğe ekleyebilirsiniz.
                  </div>
                )}
              </div>
            </>
          )}

          {section === 'projects' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Başlık girin"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık girin"
                />
              </div>
              <div className="border-t border-slate-200 dark:border-[#2E2E2E] pt-6 transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Projects</h3>
                  <button
                    onClick={() => addItem('items', {
                      id: Date.now().toString(),
                      title: '',
                      description: '',
                      image: '',
                      link: '',
                      type: 'web',
                      privacyPolicy: ''
                    })}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Add Project
                  </button>
                </div>
                {data.items?.map((item: ProjectItem, index: number) => (
                  <div key={item.id} className="bg-white dark:bg-[#111] p-4 rounded-lg mb-4 border border-slate-200 dark:border-[#2E2E2E] shadow-lg dark:shadow-none transition-colors duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 mb-2 text-sm transition-colors duration-500">Title</label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => updateItem('items', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 mb-2 text-sm transition-colors duration-500">Type</label>
                        <select
                          value={item.type || 'web'}
                          onChange={(e) => updateItem('items', index, 'type', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          style={inputStyle}
                        >
                          <option value="web">Web</option>
                          <option value="mobile-app-template">Mobile App Template</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Project Image</label>
                        <div className="flex gap-2 items-start">
                          <input
                            type="text"
                            value={item.image || ''}
                            onChange={(e) => updateItem('items', index, 'image', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                            style={inputStyle}
                            placeholder="/image.png or upload from gallery"
                          />
                          <button
                            type="button"
                            onClick={() => openGallery((url) => updateItem('items', index, 'image', url))}
                            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiImage className="w-4 h-4" />
                            <span>Galeri</span>
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const url = await handleFileUpload(file, 'uploads');
                                  updateItem('items', index, 'image', url);
                                } catch (error) {
                                  // Error already handled in handleFileUpload
                                }
                              }
                              // Reset input
                              e.target.value = '';
                            }}
                            className="hidden"
                            id={`project-image-upload-${index}`}
                          />
                          <label
                            htmlFor={`project-image-upload-${index}`}
                            className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiCamera className="w-4 h-4" />
                            <span>Yükle</span>
                          </label>
                        </div>
                        {item.image && (
                          <div className="mt-3">
                            <Image 
                              src={item.image} 
                              alt="Project preview" 
                              width={300}
                              height={192}
                              className="w-full max-w-xs h-48 object-cover rounded-lg border border-white/20" 
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 mb-2 text-sm transition-colors duration-500">Link</label>
                        <input
                          type="text"
                          value={item.link || ''}
                          onChange={(e) => updateItem('items', index, 'link', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Description</label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updateItem('items', index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          rows={3}
                          style={inputStyle}
                      />
                    </div>
                    {item.type === 'mobile-app-template' && (
                      <div className="mb-4">
                        <label className="block text-slate-700 dark:text-gray-300 mb-2 text-sm transition-colors duration-500">Privacy Policy Text</label>
                        <textarea
                          value={item.privacyPolicy || ''}
                          onChange={(e) => updateItem('items', index, 'privacyPolicy', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          style={inputStyle}
                          rows={6}
                          placeholder="Enter privacy policy text here..."
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeItem('items', index)}
                      className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'contact' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Başlık</label>
                <input
                  type="text"
                  value={data?.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                  style={inputStyle}
                  placeholder="Örn: İletişim"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Alt Başlık</label>
                <input
                  type="text"
                  value={data?.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                  style={inputStyle}
                  placeholder="Örn: İletişime Geç"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500 flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  Email Adresi
                </label>
                <input
                  type="email"
                  value={data?.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                  style={inputStyle}
                  placeholder="örnek@email.com"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500 flex items-center gap-2">
                  <FiPhone className="w-4 h-4" />
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  value={data?.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                  style={inputStyle}
                  placeholder="+90 555 123 45 67"
                />
              </div>
              <div>
                <label className="block text-slate-900 dark:text-white/90 mb-2 font-semibold transition-colors duration-500">Açıklama</label>
                <textarea
                  value={data?.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 resize-y font-medium"
                  style={inputStyle}
                  rows={6}
                  placeholder="İletişim bölümü için açıklama metni..."
                />
              </div>
            </>
          )}

          {section === 'subdomainProjects' && (
            <>
              <div className="border-t border-slate-200 dark:border-white/20 pt-6 transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors duration-500">Subdomain Projeleri</h3>
                  <div className="flex gap-2 items-center">
                    <select
                      id="new-project-category"
                      defaultValue="mobile-app"
                      className="admin-select px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                      style={inputStyle}
                    >
                      <option value="mobile-app">📱 Mobile App (Biorhythm Template)</option>
                      <option value="ecommerce">🛒 E-commerce (LuxeStyle Template)</option>
                      <option value="game">🎮 Game (Shadow Quest Template)</option>
                      <option value="saas">💼 SaaS/Software (Classic Template)</option>
                      <option value="social">👥 Social (Falla Template)</option>
                    </select>
                    <button
                      onClick={() => {
                        const categorySelect = document.getElementById('new-project-category') as HTMLSelectElement;
                        const selectedCategory = categorySelect?.value || 'mobile-app';
                        // Get template from hardcoded templates (always available)
                        const templateProject = getTemplateProject(selectedCategory);
                        
                        const newProject = templateProject 
                          ? {
                              ...templateProject,
                              id: Date.now().toString(),
                              name: '',
                              subdomain: '',
                              category: selectedCategory as any,
                            }
                          : {
                              id: Date.now().toString(),
                              name: '',
                              subdomain: '',
                              category: selectedCategory as any,
                              title: '',
                              description: '',
                              tagline: '',
                              logo: '',
                              coverImage: '',
                              features: [] as string[],
                              screenshots: [] as string[],
                              appStoreLink: '',
                              playStoreLink: '',
                              techStack: [] as string[],
                              published: true,
                              metadata: {
                                metaTitle: '',
                                metaDescription: '',
                                keywords: [] as string[]
                              }
                            };
                        addItem('subdomainProjects', newProject);
                      }}
                      className="px-4 py-2 bg-purple-600 dark:bg-purple-600 rounded-lg hover:bg-purple-700 text-white text-sm font-medium transition-all duration-200"
                      style={inputStyle}
                    >
                      Proje Ekle
                    </button>
                  </div>
                </div>
                {Array.isArray(data) && data.map((project: SubdomainProject, index: number) => (
                  <div key={project.id || index} className="backdrop-blur-md bg-white dark:bg-white/5 p-5 rounded-xl mb-4 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 shadow-lg dark:shadow-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Proje Adı</label>
                        <input
                          type="text"
                          value={project.name || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="Biorhythm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Subdomain</label>
                        <input
                          type="text"
                          value={project.subdomain || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'subdomain', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="app"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Kategori</label>
                        <select
                          value={project.category || 'mobile-app'}
                          onChange={(e) => {
                            const newCategory = e.target.value;
                            handleCategoryChange(index, newCategory);
                          }}
                          className="admin-select w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                        >
                          <option value="mobile-app">📱 Mobile App (Biorhythm Template)</option>
                          <option value="ecommerce">🛒 E-commerce (LuxeStyle Template)</option>
                          <option value="game">🎮 Game (Shadow Quest Template)</option>
                          <option value="saas">💼 SaaS/Software (Classic Template)</option>
                          <option value="social">👥 Social (Falla Template)</option>
                        </select>
                        <p className="text-slate-600 dark:text-white/50 text-xs mt-1 font-medium transition-colors duration-500">
                          Kategori seçildiğinde ilgili template içeriği otomatik kopyalanır
                        </p>
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Başlık</label>
                        <input
                          type="text"
                          value={project.title || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="Biorhythm - Daily Wellness Tracker"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Tagline</label>
                        <input
                          type="text"
                          value={project.tagline || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'tagline', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="Understand yourself better every day"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Açıklama</label>
                        <textarea
                          value={project.description || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 resize-none font-medium"
                          rows={3}
                          style={inputStyle}
                          placeholder="Track your physical, emotional, and intellectual biorhythms..."
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Logo</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={project.logo || ''}
                            onChange={(e) => updateItem('subdomainProjects', index, 'logo', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                            style={inputStyle}
                            placeholder="/logo.png"
                          />
                          <button
                            type="button"
                            onClick={() => openGallery((url) => updateItem('subdomainProjects', index, 'logo', url))}
                            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center justify-center"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiImage className="w-4 h-4" />
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleImageChange('subdomainProjects', index, 'logo', file);
                                // Reset input to allow same file selection again
                                e.target.value = '';
                              }
                            }}
                            className="hidden"
                            id={`logo-upload-${index}`}
                          />
                          <label
                            htmlFor={`logo-upload-${index}`}
                            className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center justify-center"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiCamera className="w-4 h-4" />
                          </label>
                        </div>
                        {project.logo && (
                          <Image src={project.logo} alt="Logo preview" width={64} height={64} className="mt-2 w-16 h-16 object-cover rounded-lg border border-white/20" />
                        )}
                        <p className="text-slate-600 dark:text-white/50 text-xs mt-1 font-medium transition-colors duration-500">Önerilen boyut: 512x512px (PNG, şeffaf arka plan)</p>
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Cover Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={project.coverImage || ''}
                            onChange={(e) => updateItem('subdomainProjects', index, 'coverImage', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                            style={inputStyle}
                            placeholder="/cover.jpg"
                          />
                          <button
                            type="button"
                            onClick={() => openGallery((url) => updateItem('subdomainProjects', index, 'coverImage', url))}
                            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center justify-center"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiImage className="w-4 h-4" />
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleImageChange('subdomainProjects', index, 'coverImage', file);
                                // Reset input to allow same file selection again
                                e.target.value = '';
                              }
                            }}
                            className="hidden"
                            id={`cover-upload-${index}`}
                          />
                          <label
                            htmlFor={`cover-upload-${index}`}
                            className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center justify-center"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiCamera className="w-4 h-4" />
                          </label>
                        </div>
                        {project.coverImage && (
                          <Image src={project.coverImage} alt="Cover preview" width={800} height={128} className="mt-2 w-full h-32 object-cover rounded-lg border border-white/20" />
                        )}
                        <p className="text-white/50 text-xs mt-1">Önerilen boyut: 1920x1080px (JPG/PNG, 16:9 oran)</p>
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">App Store Link</label>
                        <input
                          type="text"
                          value={project.appStoreLink || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'appStoreLink', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="https://apps.apple.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Play Store Link</label>
                        <input
                          type="text"
                          value={project.playStoreLink || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'playStoreLink', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="https://play.google.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">
                          Site Link (Website URL) {project.category === 'ecommerce' && <span className="text-purple-600 dark:text-purple-400">*</span>}
                        </label>
                        <input
                          type="text"
                          value={(project as any).siteLink || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'siteLink', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                          style={inputStyle}
                          placeholder="https://example.com"
                        />
                        {project.category === 'ecommerce' && (
                          <p className="text-slate-600 dark:text-white/50 text-xs mt-1 font-medium transition-colors duration-500">E-ticaret projeleri için site linki gereklidir</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Features (her satır bir feature)</label>
                      <textarea
                        value={(project.features || []).join('\n')}
                        onChange={(e) => updateItem('subdomainProjects', index, 'features', e.target.value.split('\n').filter(f => f.trim()))}
                        className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 resize-none font-medium"
                        rows={4}
                        style={inputStyle}
                        placeholder="Daily biorhythm tracking&#10;Personalized wellness insights"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Tech Stack (virgülle ayrılmış)</label>
                      <input
                        type="text"
                        value={(project.techStack || []).join(', ')}
                        onChange={(e) => updateItem('subdomainProjects', index, 'techStack', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                        className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                        style={inputStyle}
                        placeholder="React Native, TypeScript, ML Kit"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Screenshots</label>
                      <div className="space-y-2">
                        {(project.screenshots || []).map((screenshot, screenshotIndex) => (
                          <div key={screenshotIndex} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={screenshot}
                              onChange={(e) => {
                                const screenshots = [...(project.screenshots || [])];
                                screenshots[screenshotIndex] = e.target.value;
                                updateItem('subdomainProjects', index, 'screenshots', screenshots);
                              }}
                              className="flex-1 px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                              style={inputStyle}
                              placeholder="/screenshot.jpg"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const url = await handleFileUpload(file, 'uploads');
                                    // Directly update the screenshots array for this project
                                    setData((prev: any) => {
                                      const currentArray = Array.isArray(prev) ? prev : [];
                                      const newArray = [...currentArray];
                                      
                                      if (!newArray[index]) {
                                        newArray[index] = { ...project };
                                      }
                                      
                                      const screenshots = [...(newArray[index].screenshots || [])];
                                      screenshots[screenshotIndex] = url;
                                      newArray[index] = { ...newArray[index], screenshots };
                                      
                                      return newArray;
                                    });
                                    // Reset input to allow same file selection again
                                    e.target.value = '';
                                  } catch (error) {
                                    console.error('Error uploading screenshot:', error);
                                    alert('Screenshot yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
                                  }
                                }
                              }}
                              className="hidden"
                              id={`screenshot-upload-${index}-${screenshotIndex}`}
                            />
                            <label
                              htmlFor={`screenshot-upload-${index}-${screenshotIndex}`}
                              className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center justify-center"
                              style={inputStyle}
                            >
                              <FiCamera className="w-4 h-4" />
                            </label>
                            <button
                              onClick={() => {
                                const screenshots = (project.screenshots || []).filter((_, i) => i !== screenshotIndex);
                                updateItem('subdomainProjects', index, 'screenshots', screenshots);
                              }}
                              className="px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-200"
                              style={inputStyle}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const screenshots = [...(project.screenshots || []), ''];
                            updateItem('subdomainProjects', index, 'screenshots', screenshots);
                          }}
                          className="px-3 py-2 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all duration-200 font-medium"
                          style={inputStyle}
                        >
                          + Screenshot Ekle
                        </button>
                      </div>
                      <p className="text-white/50 text-xs mt-1">Önerilen boyut: 1080x1920px (Mobil) veya 1920x1080px (Web) (JPG/PNG)</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Meta Title</label>
                      <input
                        type="text"
                        value={project.metadata?.metaTitle || ''}
                        onChange={(e) => updateItem('subdomainProjects', index, 'metadata', { ...project.metadata, metaTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                        style={inputStyle}
                        placeholder="Biorhythm - Daily Wellness Tracker"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Meta Description</label>
                      <textarea
                        value={project.metadata?.metaDescription || ''}
                        onChange={(e) => updateItem('subdomainProjects', index, 'metadata', { ...project.metadata, metaDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 resize-none font-medium"
                        rows={2}
                        style={inputStyle}
                        placeholder="Track your biorhythms and get personalized wellness insights"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-slate-900 dark:text-white/90 mb-2 text-sm font-semibold transition-colors duration-500">Keywords (virgülle ayrılmış)</label>
                      <input
                        type="text"
                        value={(project.metadata?.keywords || []).join(', ')}
                        onChange={(e) => updateItem('subdomainProjects', index, 'metadata', { ...project.metadata, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) })}
                        className="w-full px-3 py-2 bg-white dark:bg-white/10 backdrop-blur-sm border-2 border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:border-slate-600 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300 font-medium"
                        style={inputStyle}
                        placeholder="wellness, biorhythm, health"
                      />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={project.published !== false}
                          onChange={(e) => updateItem('subdomainProjects', index, 'published', e.target.checked)}
                          className="w-4 h-4 cursor-pointer accent-slate-900 dark:accent-white/60"
                          style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                        />
                        <span className="text-white/90 text-sm">Yayınla</span>
                      </label>
                    </div>

                    <button
                      onClick={() => removeItem('subdomainProjects', index)}
                      className="px-3 py-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-200"
                      style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'social' && (
            <>
              <div className="border-t border-slate-200 dark:border-[#2E2E2E] pt-6 transition-colors duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Social Links</h3>
                  <button
                    onClick={() => {
                      const newData = Array.isArray(data) ? [...data] : [];
                      newData.push({
                        link: '',
                        image: '',
                        alt: ''
                      });
                      setData(newData);
                    }}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Add Link
                  </button>
                </div>
                {Array.isArray(data) && data.map((item: SocialIcon, index: number) => (
                  <div key={index} className="bg-white dark:bg-[#111] p-4 rounded-lg mb-4 border border-slate-200 dark:border-[#2E2E2E] shadow-lg dark:shadow-none transition-colors duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 mb-2 text-sm transition-colors duration-500">Link</label>
                        <input
                          type="text"
                          value={item.link || ''}
                          onChange={(e) => {
                            const newData = [...(Array.isArray(data) ? data : [])];
                            newData[index] = { ...newData[index], link: e.target.value };
                            setData(newData);
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 mb-2 text-sm transition-colors duration-500">Image (path)</label>
                        <input
                          type="text"
                          value={item.image || ''}
                          onChange={(e) => {
                            const newData = [...(Array.isArray(data) ? data : [])];
                            newData[index] = { ...newData[index], image: e.target.value };
                            setData(newData);
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-gray-300 mb-2 text-sm transition-colors duration-500">Alt Text</label>
                        <input
                          type="text"
                          value={item.alt || ''}
                          onChange={(e) => {
                            const newData = [...(Array.isArray(data) ? data : [])];
                            newData[index] = { ...newData[index], alt: e.target.value };
                            setData(newData);
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-[#2E2E2E] rounded text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-500 dark:focus:border-purple-500 transition-colors duration-500"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newData = Array.isArray(data) ? data.filter((_: any, i: number) => i !== index) : [];
                        setData(newData);
                      }}
                      className="mt-4 px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}


          {section === 'skills' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Yetenekler</h3>
                  <button
                    onClick={() => addItem('items', {
                      id: Date.now().toString(),
                      name: '',
                      icon: '',
                      level: 50,
                      category: 'frontend'
                    })}
                    className="px-4 py-2 bg-slate-900 dark:bg-white/20 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-white/30"
                    style={inputStyle}
                  >
                    + Yeni Yetenek
                  </button>
                </div>
                {(data.items || []).map((skill: any, index: number) => (
                  <div key={skill.id || index} className="mb-4 p-4 border border-slate-200 dark:border-white/10 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">İsim</label>
                        <input
                          type="text"
                          value={skill.name || ''}
                          onChange={(e) => updateItem('items', index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Kategori</label>
                        <select
                          value={skill.category || 'frontend'}
                          onChange={(e) => updateItem('items', index, 'category', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        >
                          <option value="frontend">Frontend</option>
                          <option value="backend">Backend</option>
                          <option value="mobile">Mobile</option>
                          <option value="tools">Tools</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Seviye (1-100)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={skill.level || 50}
                          onChange={(e) => updateItem('items', index, 'level', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Icon (emoji)</label>
                        <input
                          type="text"
                          value={skill.icon || ''}
                          onChange={(e) => updateItem('items', index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                          placeholder="📱"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem('items', index)}
                      className="mt-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30"
                      style={inputStyle}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'statistics' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">İstatistikler</h3>
                  <button
                    onClick={() => addItem('items', {
                      id: Date.now().toString(),
                      label: '',
                      value: '',
                      icon: '',
                      suffix: ''
                    })}
                    className="px-4 py-2 bg-slate-900 dark:bg-white/20 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-white/30"
                    style={inputStyle}
                  >
                    + Yeni İstatistik
                  </button>
                </div>
                {(data.items || []).map((stat: any, index: number) => (
                  <div key={stat.id || index} className="mb-4 p-4 border border-slate-200 dark:border-white/10 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Etiket</label>
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={(e) => updateItem('items', index, 'label', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Değer</label>
                        <input
                          type="text"
                          value={stat.value || ''}
                          onChange={(e) => updateItem('items', index, 'value', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Suffix</label>
                        <input
                          type="text"
                          value={stat.suffix || ''}
                          onChange={(e) => updateItem('items', index, 'suffix', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                          placeholder="+"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Icon</label>
                        <input
                          type="text"
                          value={stat.icon || ''}
                          onChange={(e) => updateItem('items', index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                          placeholder="İkon (emoji veya metin)"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem('items', index)}
                      className="mt-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30"
                      style={inputStyle}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'services' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Hizmetler</h3>
                  <button
                    onClick={() => addItem('items', {
                      id: Date.now().toString(),
                      title: '',
                      description: '',
                      icon: '📱',
                      features: [],
                      price: ''
                    })}
                    className="px-4 py-2 bg-slate-900 dark:bg-white/20 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-white/30"
                    style={inputStyle}
                  >
                    + Yeni Hizmet
                  </button>
                </div>
                {(data.items || []).map((service: any, index: number) => (
                  <div key={service.id || index} className="mb-6 p-4 border border-slate-200 dark:border-white/10 rounded-xl">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Başlık</label>
                          <input
                            type="text"
                            value={service.title || ''}
                            onChange={(e) => updateItem('items', index, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Icon</label>
                          <input
                            type="text"
                            value={service.icon || ''}
                            onChange={(e) => updateItem('items', index, 'icon', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                            style={inputStyle}
                            placeholder="📱"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Açıklama</label>
                        <textarea
                          value={service.description || ''}
                          onChange={(e) => updateItem('items', index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm resize-none"
                          rows={3}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Özellikler (virgülle ayırın)</label>
                        <input
                          type="text"
                          value={Array.isArray(service.features) ? service.features.join(', ') : ''}
                          onChange={(e) => updateItem('items', index, 'features', e.target.value.split(',').map(f => f.trim()).filter(Boolean))}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                          placeholder="Özellik 1, Özellik 2, Özellik 3"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Fiyat (opsiyonel)</label>
                        <input
                          type="text"
                          value={service.price || ''}
                          onChange={(e) => updateItem('items', index, 'price', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem('items', index)}
                      className="mt-4 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30"
                      style={inputStyle}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'faq' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white"
                  style={inputStyle}
                />
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sorular</h3>
                  <button
                    onClick={() => addItem('items', {
                      id: Date.now().toString(),
                      question: '',
                      answer: '',
                      category: 'genel'
                    })}
                    className="px-4 py-2 bg-slate-900 dark:bg-white/20 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-white/30"
                    style={inputStyle}
                  >
                    + Yeni Soru
                  </button>
                </div>
                {(data.items || []).map((faq: any, index: number) => (
                  <div key={faq.id || index} className="mb-4 p-4 border border-slate-200 dark:border-white/10 rounded-xl">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Kategori</label>
                        <select
                          value={faq.category || 'genel'}
                          onChange={(e) => updateItem('items', index, 'category', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        >
                          <option value="genel">Genel</option>
                          <option value="teknik">Teknik</option>
                          <option value="destek">Destek</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Soru</label>
                        <input
                          type="text"
                          value={faq.question || ''}
                          onChange={(e) => updateItem('items', index, 'question', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-white/90 mb-2 text-sm">Cevap</label>
                        <textarea
                          value={faq.answer || ''}
                          onChange={(e) => updateItem('items', index, 'answer', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm resize-none"
                          rows={4}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem('items', index)}
                      className="mt-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30"
                      style={inputStyle}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {section === 'blog' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Blog başlığı"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Giriş Başlığı</label>
                <input
                  type="text"
                  value={data.introTitle || ''}
                  onChange={(e) => updateField('introTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-slate-500 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-500/50 dark:focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Giriş başlığı"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-white/90 mb-2 font-medium transition-colors duration-500">Giriş Açıklaması</label>
                <textarea
                  value={data.introDescription || ''}
                  onChange={(e) => updateField('introDescription', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                  rows={4}
                  style={inputStyle}
                  placeholder="Giriş açıklaması"
                />
              </div>
              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Blog Yazıları</h3>
                  <button
                    onClick={() => addItem('posts', {
                      id: Date.now().toString(),
                      title: '',
                      excerpt: '',
                      content: '',
                      image: '',
                      date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
                      author: 'Loegs',
                      category: 'development',
                      readTime: '5 dk',
                      published: true
                    })}
                    className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg font-medium hover:bg-white/30 transition-all duration-200"
                    style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                  >
                    Yazı Ekle
                  </button>
                </div>
                {data.posts?.map((post: BlogPost, index: number) => (
                  <div key={post.id} className="backdrop-blur-md bg-white/5 p-5 rounded-xl mb-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Başlık</label>
                        <input
                          type="text"
                          value={post.title || ''}
                          onChange={(e) => updateItem('posts', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="Blog yazısı başlığı"
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Kategori</label>
                        <select
                          value={post.category || 'journal'}
                          onChange={(e) => updateItem('posts', index, 'category', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                        >
                          <option value="journal">Günlük</option>
                          <option value="campaign">Kampanya</option>
                          <option value="design">Tasarım</option>
                          <option value="lifestyle">Yaşam Tarzı</option>
                          <option value="studio">Stüdyo</option>
                          <option value="development">Geliştirme</option>
                          <option value="nightshift">Gece Vardiyası</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Görsel (path)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={post.image || ''}
                            onChange={(e) => updateItem('posts', index, 'image', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                            style={inputStyle}
                            placeholder="/image.png"
                          />
                          <button
                            type="button"
                            onClick={() => openGallery((url) => updateItem('posts', index, 'image', url))}
                            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center justify-center"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiImage className="w-4 h-4" />
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const url = await handleFileUpload(file, 'uploads');
                                  updateItem('posts', index, 'image', url);
                                } catch (error) {
                                  // Error already handled
                                }
                              }
                              e.target.value = '';
                            }}
                            className="hidden"
                            id={`blog-image-upload-${index}`}
                          />
                          <label
                            htmlFor={`blog-image-upload-${index}`}
                            className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center justify-center"
                            style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                          >
                            <FiCamera className="w-4 h-4" />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Tarih</label>
                        <input
                          type="text"
                          value={post.date || ''}
                          onChange={(e) => updateItem('posts', index, 'date', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="15 Ocak 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Yazar</label>
                        <input
                          type="text"
                          value={post.author || ''}
                          onChange={(e) => updateItem('posts', index, 'author', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="Yazar adı"
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Okuma Süresi</label>
                        <input
                          type="text"
                          value={post.readTime || ''}
                          onChange={(e) => updateItem('posts', index, 'readTime', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="5 dk"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">Özet</label>
                      <textarea
                        value={post.excerpt || ''}
                        onChange={(e) => updateItem('posts', index, 'excerpt', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                        rows={3}
                        style={inputStyle}
                        placeholder="Blog yazısı özeti"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">İçerik</label>
                      <textarea
                        value={post.content || ''}
                        onChange={(e) => updateItem('posts', index, 'content', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                        rows={8}
                        style={inputStyle}
                        placeholder="Blog yazısı içeriği"
                      />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={post.published !== false}
                          onChange={(e) => updateItem('posts', index, 'published', e.target.checked)}
                          className="w-4 h-4 cursor-pointer accent-slate-900 dark:accent-white/60"
                          style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                        />
                        <span className="text-white/90 text-sm">Yayınla</span>
                      </label>
                    </div>
                    <button
                      onClick={() => removeItem('posts', index)}
                      className="px-3 py-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-200"
                      style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => {
            setShowGallery(false);
            setGalleryCallback(null);
          }}
          style={{ position: 'fixed', zIndex: 9999 }}
        >
          <div 
            className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl dark:shadow-none transition-colors duration-500"
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 10000 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-slate-900 dark:text-white text-xl font-semibold transition-colors duration-500">Galeri</h2>
              <button
                onClick={() => {
                  setShowGallery(false);
                  setGalleryCallback(null);
                }}
                className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white text-2xl transition-colors duration-500"
                style={{ position: 'relative', zIndex: 10001, pointerEvents: 'auto' }}
              >
                ×
              </button>
            </div>
            
            {galleryImages.length === 0 ? (
              <div className="text-slate-600 dark:text-white/60 text-center py-8 font-medium transition-colors duration-500">
                Henüz görsel yüklenmemiş. Yeni görsel yüklemek için &quot;Yükle&quot; butonunu kullanın.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((imageUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group cursor-pointer"
                    onClick={() => selectImageFromGallery(imageUrl)}
                    style={{ position: 'relative', zIndex: 10001, pointerEvents: 'auto' }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Gallery ${idx + 1}`}
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-white/20 group-hover:border-slate-400 dark:group-hover:border-white/40 transition-all"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-all flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm">Seç</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


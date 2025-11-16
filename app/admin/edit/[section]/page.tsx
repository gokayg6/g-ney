"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PortfolioData, HeroData, AboutData, ExperienceData, ProjectsData, ContactData, SocialIcon, ExperienceItem, ProjectItem, BlogPost } from '@/lib/data';
import { SubdomainProject } from '@/lib/subdomain-data';
import StarsCanvas from '@/components/main/StarsBackground';

export default function EditSection() {
  const router = useRouter();
  const params = useParams();
  const section = params.section as string;
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [allSubdomainProjects, setAllSubdomainProjects] = useState<SubdomainProject[]>([]);

  useEffect(() => {
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
  }, [router, section]);

  const loadData = async () => {
    try {
      const res = await fetch('/api/content');
      const content: PortfolioData = await res.json();
      const sectionData = (content as any)[section];
      
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
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await res.json();

      if (res.ok) {
        // Update allSubdomainProjects if this is subdomainProjects section
        if (section === 'subdomainProjects' && Array.isArray(data)) {
          setAllSubdomainProjects(data);
        }
        alert('Saved successfully!');
        router.push('/admin/dashboard');
      } else {
        alert(`Failed to save: ${result.error || 'Unknown error'}`);
        console.error('Save error:', result);
      }
    } catch (error) {
      alert(`Error saving: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      // For object sections, data is an object with arrays inside
      setData((prev: any) => {
        const currentArray = Array.isArray(prev[arrayName]) ? prev[arrayName] : [];
        const newArray = [...currentArray];
        
        // Ensure index exists
        if (!newArray[index]) {
          newArray[index] = {};
        }
        
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [arrayName]: newArray };
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
        throw new Error('Upload failed');
      }

      const result = await response.json();
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
          
          newArray[index] = { ...newArray[index], [field]: url };
          return newArray;
        });
      } else {
        updateItem(arrayName, index, field, url);
      }
    } catch (error) {
      // Error already handled in handleFileUpload
    }
  };

  // Map categories to template subdomains
  const getTemplateSubdomain = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'mobile-app': 'app',
      'ecommerce': 'shop',
      'game': 'testgame',
      'saas': 'app',
      'website': 'falla',
      'software': 'app'
    };
    return categoryMap[category] || 'app';
  };

  // Clone template data when category changes
  const handleCategoryChange = (index: number, newCategory: string) => {
    if (section !== 'subdomainProjects') return;
    
    const templateSubdomain = getTemplateSubdomain(newCategory);
    const templateProject = allSubdomainProjects.find(p => p.subdomain === templateSubdomain);
    
    if (templateProject) {
      // Clone template data but keep the current project's id, name, subdomain
      setData((prev: any) => {
        const currentArray = Array.isArray(prev) ? prev : [];
        const newArray = [...currentArray];
        
        const currentProject = newArray[index] || {};
        newArray[index] = {
          ...templateProject,
          id: currentProject.id || Date.now().toString(),
          name: currentProject.name || templateProject.name,
          subdomain: currentProject.subdomain || templateProject.subdomain,
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
        <div className="text-white text-xl backdrop-blur-md bg-white/10 px-6 py-3 rounded-xl border border-white/20 animate-pulse">
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
        <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 mb-4 border border-white/20 shadow-2xl animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white mb-1">
                {section.charAt(0).toUpperCase() + section.slice(1)} Düzenle
              </h1>
              <p className="text-white/60 text-xs">İçeriği düzenleyin ve kaydedin</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200 active:scale-95"
                style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg text-sm font-semibold hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg"
                style={{ position: 'relative', zIndex: 105, pointerEvents: 'auto' }}
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {section === 'hero' && (
            <>
              <div>
                <label className="block text-white/90 mb-2 font-medium">İsim</label>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="İsminizi girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Tagline</label>
                <input
                  type="text"
                  value={data.tagline || ''}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Tagline'ınızı girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Tagline Vurgusu</label>
                <input
                  type="text"
                  value={data.taglineHighlight || ''}
                  onChange={(e) => updateField('taglineHighlight', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Vurgulanacak kelime"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Açıklama</label>
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
                <label className="block text-white/90 mb-2 font-medium">Buton Metni</label>
                <input
                  type="text"
                  value={data.buttonText || ''}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Buton metni"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Buton Linki</label>
                <input
                  type="text"
                  value={data.buttonLink || ''}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="https://example.com"
                />
              </div>
            </>
          )}

          {section === 'about' && (
            <>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Başlık girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Açıklama</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
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
                <label className="block text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Başlık girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık girin"
                />
              </div>
              <div className="border-t border-[#2E2E2E] pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Experience Items</h3>
                  <button
                    onClick={() => addItem('items', {
                      id: Date.now().toString(),
                      company: '',
                      companyLogo: '',
                      position: '',
                      period: '',
                      description: '',
                      skills: []
                    })}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Add Item
                  </button>
                </div>
                {data.items?.map((item: ExperienceItem, index: number) => (
                  <div key={item.id} className="bg-[#111] p-4 rounded-lg mb-4 border border-[#2E2E2E]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Şirket</label>
                        <input
                          type="text"
                          value={item.company || ''}
                          onChange={(e) => updateItem('items', index, 'company', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="Şirket adı"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Position</label>
                        <input
                          type="text"
                          value={item.position || ''}
                          onChange={(e) => updateItem('items', index, 'position', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Period</label>
                        <input
                          type="text"
                          value={item.period || ''}
                          onChange={(e) => updateItem('items', index, 'period', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Company Logo (path)</label>
                        <input
                          type="text"
                          value={item.companyLogo || ''}
                          onChange={(e) => updateItem('items', index, 'companyLogo', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Description</label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updateItem('items', index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          rows={4}
                          style={inputStyle}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={item.skills?.join(', ') || ''}
                        onChange={(e) => updateItem('items', index, 'skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm"
                      />
                    </div>
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

          {section === 'projects' && (
            <>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Başlık girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık girin"
                />
              </div>
              <div className="border-t border-[#2E2E2E] pt-6">
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
                  <div key={item.id} className="bg-[#111] p-4 rounded-lg mb-4 border border-[#2E2E2E]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Title</label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => updateItem('items', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Type</label>
                        <select
                          value={item.type || 'web'}
                          onChange={(e) => updateItem('items', index, 'type', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
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
                            }}
                            className="hidden"
                            id={`project-image-upload-${index}`}
                          />
                          <label
                            htmlFor={`project-image-upload-${index}`}
                            className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200 flex items-center gap-1"
                            style={inputStyle}
                          >
                            <span>📷</span>
                            <span>Upload</span>
                          </label>
                        </div>
                        {item.image && (
                          <div className="mt-3">
                            <img 
                              src={item.image} 
                              alt="Project preview" 
                              className="w-full max-w-xs h-48 object-cover rounded-lg border border-white/20" 
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Link</label>
                        <input
                          type="text"
                          value={item.link || ''}
                          onChange={(e) => updateItem('items', index, 'link', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2 text-sm">Description</label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => updateItem('items', index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          rows={3}
                          style={inputStyle}
                      />
                    </div>
                    {item.type === 'mobile-app-template' && (
                      <div className="mb-4">
                        <label className="block text-gray-300 mb-2 text-sm">Privacy Policy Text</label>
                        <textarea
                          value={item.privacyPolicy || ''}
                          onChange={(e) => updateItem('items', index, 'privacyPolicy', e.target.value)}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
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
                <label className="block text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Başlık girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık girin"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={data.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="+90 555 123 45 67"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-4 py-2 bg-[#111] border border-[#2E2E2E] rounded-lg text-white focus:outline-none focus:border-purple-500"
                  style={inputStyle}
                  rows={4}
                />
              </div>
            </>
          )}

          {section === 'subdomainProjects' && (
            <>
              <div className="border-t border-white/20 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Subdomain Projeleri</h3>
                  <div className="flex gap-2 items-center">
                    <select
                      id="new-project-category"
                      defaultValue="mobile-app"
                      className="admin-select px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                      style={{ ...inputStyle, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
                    >
                      <option value="mobile-app">📱 Mobile App</option>
                      <option value="ecommerce">🛒 E-commerce</option>
                      <option value="game">🎮 Game</option>
                      <option value="saas">💼 SaaS/Software</option>
                      <option value="website">🌐 Website</option>
                    </select>
                    <button
                      onClick={() => {
                        const categorySelect = document.getElementById('new-project-category') as HTMLSelectElement;
                        const selectedCategory = categorySelect?.value || 'mobile-app';
                        const templateSubdomain = getTemplateSubdomain(selectedCategory);
                        const templateProject = allSubdomainProjects.find(p => p.subdomain === templateSubdomain);
                        
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
                      className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white text-sm font-medium transition-all duration-200"
                      style={inputStyle}
                    >
                      Proje Ekle
                    </button>
                  </div>
                </div>
                {Array.isArray(data) && data.map((project: SubdomainProject, index: number) => (
                  <div key={project.id || index} className="backdrop-blur-md bg-white/5 p-5 rounded-xl mb-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Proje Adı</label>
                        <input
                          type="text"
                          value={project.name || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="Biorhythm"
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Subdomain</label>
                        <input
                          type="text"
                          value={project.subdomain || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'subdomain', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="app"
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Kategori</label>
                        <select
                          value={project.category || 'mobile-app'}
                          onChange={(e) => {
                            const newCategory = e.target.value;
                            handleCategoryChange(index, newCategory);
                          }}
                          className="admin-select w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={{ ...inputStyle, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
                        >
                          <option value="mobile-app">📱 Mobile App (App template)</option>
                          <option value="ecommerce">🛒 E-commerce (Shop template)</option>
                          <option value="game">🎮 Game (Testgame template)</option>
                          <option value="saas">💼 SaaS/Software (App template)</option>
                          <option value="website">🌐 Website (Falla template)</option>
                        </select>
                        <p className="text-white/50 text-xs mt-1">
                          Kategori seçildiğinde ilgili template içeriği otomatik kopyalanır
                        </p>
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Başlık</label>
                        <input
                          type="text"
                          value={project.title || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="Biorhythm - Daily Wellness Tracker"
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Tagline</label>
                        <input
                          type="text"
                          value={project.tagline || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'tagline', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="Understand yourself better every day"
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Açıklama</label>
                        <textarea
                          value={project.description || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                          rows={3}
                          style={inputStyle}
                          placeholder="Track your physical, emotional, and intellectual biorhythms..."
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Logo</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={project.logo || ''}
                            onChange={(e) => updateItem('subdomainProjects', index, 'logo', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                            style={inputStyle}
                            placeholder="/logo.png"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageChange('subdomainProjects', index, 'logo', file);
                            }}
                            className="hidden"
                            id={`logo-upload-${index}`}
                          />
                          <label
                            htmlFor={`logo-upload-${index}`}
                            className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200"
                            style={inputStyle}
                          >
                            📷
                          </label>
                        </div>
                        {project.logo && (
                          <img src={project.logo} alt="Logo preview" className="mt-2 w-16 h-16 object-cover rounded-lg border border-white/20" />
                        )}
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Cover Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={project.coverImage || ''}
                            onChange={(e) => updateItem('subdomainProjects', index, 'coverImage', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                            style={inputStyle}
                            placeholder="/cover.jpg"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageChange('subdomainProjects', index, 'coverImage', file);
                            }}
                            className="hidden"
                            id={`cover-upload-${index}`}
                          />
                          <label
                            htmlFor={`cover-upload-${index}`}
                            className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200"
                            style={inputStyle}
                          >
                            📷
                          </label>
                        </div>
                        {project.coverImage && (
                          <img src={project.coverImage} alt="Cover preview" className="mt-2 w-full h-32 object-cover rounded-lg border border-white/20" />
                        )}
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">App Store Link</label>
                        <input
                          type="text"
                          value={project.appStoreLink || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'appStoreLink', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="https://apps.apple.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-white/90 mb-2 text-sm font-medium">Play Store Link</label>
                        <input
                          type="text"
                          value={project.playStoreLink || ''}
                          onChange={(e) => updateItem('subdomainProjects', index, 'playStoreLink', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="https://play.google.com/..."
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">Features (her satır bir feature)</label>
                      <textarea
                        value={(project.features || []).join('\n')}
                        onChange={(e) => updateItem('subdomainProjects', index, 'features', e.target.value.split('\n').filter(f => f.trim()))}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                        rows={4}
                        style={inputStyle}
                        placeholder="Daily biorhythm tracking&#10;Personalized wellness insights"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">Tech Stack (virgülle ayrılmış)</label>
                      <input
                        type="text"
                        value={(project.techStack || []).join(', ')}
                        onChange={(e) => updateItem('subdomainProjects', index, 'techStack', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                        style={inputStyle}
                        placeholder="React Native, TypeScript, ML Kit"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">Screenshots</label>
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
                              className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
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
                                  } catch (error) {
                                    // Error already handled in handleFileUpload
                                  }
                                }
                              }}
                              className="hidden"
                              id={`screenshot-upload-${index}-${screenshotIndex}`}
                            />
                            <label
                              htmlFor={`screenshot-upload-${index}-${screenshotIndex}`}
                              className="px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-sm cursor-pointer transition-all duration-200"
                              style={inputStyle}
                            >
                              📷
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
                          className="px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/20 transition-all duration-200"
                          style={inputStyle}
                        >
                          + Screenshot Ekle
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">Meta Title</label>
                      <input
                        type="text"
                        value={project.metadata?.metaTitle || ''}
                        onChange={(e) => updateItem('subdomainProjects', index, 'metadata', { ...project.metadata, metaTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                        style={inputStyle}
                        placeholder="Biorhythm - Daily Wellness Tracker"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">Meta Description</label>
                      <textarea
                        value={project.metadata?.metaDescription || ''}
                        onChange={(e) => updateItem('subdomainProjects', index, 'metadata', { ...project.metadata, metaDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                        rows={2}
                        style={inputStyle}
                        placeholder="Track your biorhythms and get personalized wellness insights"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-white/90 mb-2 text-sm font-medium">Keywords (virgülle ayrılmış)</label>
                      <input
                        type="text"
                        value={(project.metadata?.keywords || []).join(', ')}
                        onChange={(e) => updateItem('subdomainProjects', index, 'metadata', { ...project.metadata, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) })}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
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
                          className="w-4 h-4 cursor-pointer accent-white/60"
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
              <div className="border-t border-[#2E2E2E] pt-6">
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
                  <div key={index} className="bg-[#111] p-4 rounded-lg mb-4 border border-[#2E2E2E]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Link</label>
                        <input
                          type="text"
                          value={item.link || ''}
                          onChange={(e) => {
                            const newData = [...(Array.isArray(data) ? data : [])];
                            newData[index] = { ...newData[index], link: e.target.value };
                            setData(newData);
                          }}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Image (path)</label>
                        <input
                          type="text"
                          value={item.image || ''}
                          onChange={(e) => {
                            const newData = [...(Array.isArray(data) ? data : [])];
                            newData[index] = { ...newData[index], image: e.target.value };
                            setData(newData);
                          }}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2 text-sm">Alt Text</label>
                        <input
                          type="text"
                          value={item.alt || ''}
                          onChange={(e) => {
                            const newData = [...(Array.isArray(data) ? data : [])];
                            newData[index] = { ...newData[index], alt: e.target.value };
                            setData(newData);
                          }}
                          className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2E2E2E] rounded text-white text-sm focus:outline-none focus:border-purple-500"
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

          {section === 'blog' && (
            <>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Başlık</label>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Blog başlığı"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Alt Başlık</label>
                <input
                  type="text"
                  value={data.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Alt başlık"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Giriş Başlığı</label>
                <input
                  type="text"
                  value={data.introTitle || ''}
                  onChange={(e) => updateField('introTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                  style={inputStyle}
                  placeholder="Giriş başlığı"
                />
              </div>
              <div>
                <label className="block text-white/90 mb-2 font-medium">Giriş Açıklaması</label>
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
                        <input
                          type="text"
                          value={post.image || ''}
                          onChange={(e) => updateItem('posts', index, 'image', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300"
                          style={inputStyle}
                          placeholder="/image.png"
                        />
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
                          className="w-4 h-4 cursor-pointer accent-white/60"
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
    </div>
  );
}


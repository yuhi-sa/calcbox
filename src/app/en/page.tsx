'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/Layout/SearchBar';
import { tools } from '@/application/registry';
import { ToolCategory } from '@/domain/types';
import { toolTranslations } from '@/application/i18n';

export default function EnglishHomePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('calcbox-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem('calcbox-favorites', JSON.stringify(next));
      return next;
    });
  };

  const enCategories = [
    { id: 'all', label: 'All' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'life', label: 'Life' },
    { id: 'health', label: 'Health' },
    { id: 'money', label: 'Money' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'developer', label: 'Developer' },
    { id: 'text', label: 'Text' },
  ];

  const filteredTools = useMemo(() => {
    let result = tools;
    if (activeCategory === 'favorites') {
      result = result.filter((t) => favorites.includes(t.id));
    } else if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === (activeCategory as ToolCategory));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((t) => {
        const en = toolTranslations[t.id];
        const name = en?.name || t.name;
        const desc = en?.description || t.description;
        return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q) ||
          (t.keywords && t.keywords.some((k) => k.toLowerCase().includes(q)));
      });
    }
    return result;
  }, [search, activeCategory, favorites]);

  return (
    <>
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Quick calculations, <span className="text-[var(--color-primary)]">solved.</span>
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          A collection of 87+ free calculator tools for everyday life.
        </p>
        <p className="mt-2">
          <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline">🇯🇵 日本語版</Link>
        </p>
      </section>

      <div className="max-w-xl mx-auto mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tools... (e.g. BMI, tax, password)" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {enCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No matching tools found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const en = toolTranslations[tool.id];
            return (
              <div key={tool.id} className="relative group">
                <Link
                  href={tool.implemented ? `/en/${tool.id}` : '#'}
                  className={`block p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-[var(--color-primary)] transition-all duration-200 h-full ${!tool.implemented ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={(e) => { if (!tool.implemented) e.preventDefault(); }}
                >
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                      {en?.name || tool.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {en?.description || tool.description}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.id); }}
                  className="absolute top-2 right-2 p-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Favorite"
                >
                  {favorites.includes(tool.id) ? <span className="text-yellow-400">&#9733;</span> : <span className="text-gray-300">&#9734;</span>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

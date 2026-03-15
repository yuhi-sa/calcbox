'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/Layout/SearchBar';
import ToolGrid from '@/components/ToolGrid';
import { tools, categories } from '@/lib/tools-registry';
import { ToolCategory } from '@/lib/types';

export default function HomePage() {
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

  const filteredTools = useMemo(() => {
    let result = tools;

    // Category filter
    if (activeCategory === 'favorites') {
      result = result.filter((t) => favorites.includes(t.id));
    } else if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === (activeCategory as ToolCategory));
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, activeCategory, favorites]);

  return (
    <>
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          暮らしの計算を、<span className="text-[var(--color-primary)]">サッと解決。</span>
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          日常のちょっとした計算を、サッと解決。CalcBoxは無料で使える便利な計算ツール集です。
        </p>
        <p className="mt-2">
          <Link href="/en" className="text-sm text-[var(--color-primary)] hover:underline">🇺🇸 English</Link>
        </p>
      </section>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map((cat) => (
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

      {/* Tool grid */}
      <ToolGrid tools={filteredTools} favorites={favorites} onToggleFavorite={toggleFavorite} />
    </>
  );
}

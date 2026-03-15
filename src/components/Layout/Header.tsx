'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('calcbox-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('calcbox-theme', next ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[var(--color-primary)] no-underline">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-8 h-8">
            <rect x="3" y="2" width="26" height="28" rx="4" fill="#e67e22"/>
            <rect x="6" y="5" width="20" height="8" rx="2" fill="#fff"/>
            <rect x="7" y="16" width="4" height="4" rx="1" fill="#fff" opacity=".9"/>
            <rect x="14" y="16" width="4" height="4" rx="1" fill="#fff" opacity=".9"/>
            <rect x="21" y="16" width="4" height="4" rx="1" fill="#fff" opacity=".9"/>
            <rect x="7" y="23" width="4" height="4" rx="1" fill="#fff" opacity=".9"/>
            <rect x="14" y="23" width="4" height="4" rx="1" fill="#fff" opacity=".9"/>
            <rect x="21" y="23" width="4" height="4" rx="1" fill="#27ae60"/>
          </svg>
          CalcBox
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/bmi" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)]">BMI計算</Link>
          <Link href="/tax" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)]">消費税</Link>
          <Link href="/loan" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)]">ローン</Link>
          <Link href="/salary" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)]">給与計算</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="テーマ切替"
          >
            {darkMode ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="メニュー"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <SearchBar />
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/bmi" onClick={() => setMenuOpen(false)} className="text-sm py-2 text-gray-700 dark:text-gray-300">BMI計算</Link>
            <Link href="/tax" onClick={() => setMenuOpen(false)} className="text-sm py-2 text-gray-700 dark:text-gray-300">消費税計算</Link>
            <Link href="/loan" onClick={() => setMenuOpen(false)} className="text-sm py-2 text-gray-700 dark:text-gray-300">ローン計算</Link>
            <Link href="/salary" onClick={() => setMenuOpen(false)} className="text-sm py-2 text-gray-700 dark:text-gray-300">給与計算</Link>
            <Link href="/currency" onClick={() => setMenuOpen(false)} className="text-sm py-2 text-gray-700 dark:text-gray-300">通貨換算</Link>
          </div>
        </nav>
      )}
    </header>
  );
}

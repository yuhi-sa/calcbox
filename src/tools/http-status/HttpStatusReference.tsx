'use client';

import { useState } from 'react';
import { filterStatusCodes, CATEGORIES } from './http-status-logic';

const CATEGORY_COLORS: Record<string, string> = {
  '1xx': 'text-blue-600 dark:text-blue-400',
  '2xx': 'text-green-600 dark:text-green-400',
  '3xx': 'text-yellow-600 dark:text-yellow-400',
  '4xx': 'text-orange-600 dark:text-orange-400',
  '5xx': 'text-red-600 dark:text-red-400',
};

export default function HttpStatusReference() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('すべて');

  const filtered = filterStatusCodes(search, category);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">検索</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            placeholder="コードまたは名前で検索"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} 件のステータスコード</p>

      <div className="space-y-2">
        {filtered.map((status) => (
          <div key={status.code} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold font-mono ${CATEGORY_COLORS[status.category] || ''}`}>
                {status.code}
              </span>
              <span className="text-sm font-medium">{status.name}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{status.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

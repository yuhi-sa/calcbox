'use client';

import { useState } from 'react';
import { filterPaperSizes, getSeriesList } from './paper-size-logic';

export default function PaperSizeReference() {
  const [query, setQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');

  const seriesList = getSeriesList();
  const sizes = filterPaperSizes(query, selectedSeries || undefined);

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">検索</label>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="例: A4, はがき, L判" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSeries('')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium ${!selectedSeries ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            すべて
          </button>
          {seriesList.map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium ${selectedSeries === series ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              {series}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-200 dark:border-orange-800">
                  <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">サイズ名</th>
                  <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">シリーズ</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">幅 (mm)</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">高さ (mm)</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">幅 (inch)</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300">高さ (inch)</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((size) => (
                  <tr key={size.name} className="border-b border-orange-100 dark:border-orange-900/40 last:border-0">
                    <td className="py-2 px-2 font-medium">{size.name}</td>
                    <td className="py-2 px-2 text-gray-500 dark:text-gray-400">{size.series}</td>
                    <td className="py-2 px-2 text-right">{size.widthMm}</td>
                    <td className="py-2 px-2 text-right">{size.heightMm}</td>
                    <td className="py-2 px-2 text-right">{size.widthInch}</td>
                    <td className="py-2 px-2 text-right">{size.heightInch}</td>
                  </tr>
                ))}
                {sizes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500 dark:text-gray-400">該当するサイズが見つかりませんでした。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">B系列はJIS規格（日本工業規格）の寸法です。</p>
      </div>
    </div>
  );
}

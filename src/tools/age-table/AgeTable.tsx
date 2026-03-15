'use client';

import { useState, useMemo } from 'react';
import { generateAgeTable, filterTable } from './age-table-logic';

export default function AgeTable() {
  const currentYear = new Date().getFullYear();
  const [query, setQuery] = useState('');

  const allRows = useMemo(() => generateAgeTable(currentYear, 1930, 2025), [currentYear]);
  const filteredRows = useMemo(() => filterTable(allRows, query), [allRows, query]);

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">検索（年・年齢・元号・干支）</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: 1990, 35, 平成, 辰"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {filteredRows.length}件表示（{currentYear}年基準）
      </div>

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0">
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-3 py-2 text-left">西暦</th>
              <th className="px-3 py-2 text-left">和暦</th>
              <th className="px-3 py-2 text-right">年齢</th>
              <th className="px-3 py-2 text-center">干支</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.westernYear} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-3 py-2">{row.westernYear}年</td>
                <td className="px-3 py-2">{row.eraDisplay}</td>
                <td className="px-3 py-2 text-right">{row.age}歳</td>
                <td className="px-3 py-2 text-center">{row.zodiac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

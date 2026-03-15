'use client';

import { useState } from 'react';
import { parseDate, formatDate, DateFormats } from './date-format-logic';

export default function DateFormatConverter() {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [input, setInput] = useState(todayStr);
  const [result, setResult] = useState<DateFormats | null>(null);
  const [error, setError] = useState('');

  const convert = () => {
    const date = parseDate(input);
    if (!date) {
      setError('有効な日付を入力してください。');
      setResult(null);
      return;
    }
    setError('');
    setResult(formatDate(date));
  };

  const reset = () => {
    setInput(todayStr);
    setResult(null);
    setError('');
  };

  const formatRows: { label: string; key: keyof DateFormats }[] = [
    { label: 'ISO 8601', key: 'iso8601' },
    { label: 'YYYY-MM-DD', key: 'yyyymmdd' },
    { label: 'DD/MM/YYYY', key: 'ddmmyyyy' },
    { label: 'MM/DD/YYYY', key: 'mmddyyyy' },
    { label: '日本語', key: 'japanese' },
    { label: '日本語（曜日付き）', key: 'japaneseFull' },
    { label: 'RFC 2822', key: 'rfc2822' },
    { label: 'Unix Timestamp', key: 'unixTimestamp' },
    { label: '曜日（英語）', key: 'dayOfWeek' },
    { label: '曜日（日本語）', key: 'dayOfWeekJa' },
    { label: '相対日付', key: 'relative' },
  ];

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">日付を入力</label>
          <input
            type="date"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button onClick={convert} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-2">
          {formatRows.map(({ label, key }) => (
            <div key={key} className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
              <span className="text-sm font-semibold font-mono">{String(result[key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

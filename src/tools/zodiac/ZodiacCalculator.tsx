'use client';

import { useState } from 'react';
import { getZodiac, ZodiacResult } from './zodiac-logic';

export default function ZodiacCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<ZodiacResult | null>(null);

  const calculate = () => {
    if (!birthDate) {
      alert('生年月日を入力してください。');
      return;
    }
    const date = new Date(birthDate);
    setResult(getZodiac(date));
  };

  const reset = () => {
    setBirthDate('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">生年月日</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">判定する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">西洋星座</p>
            <p className="text-4xl font-bold text-orange-500">{result.western.symbol} {result.western.japaneseName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{result.western.sign}（{result.western.dateRange}）</p>
          </div>

          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">干支（えと）</p>
            <p className="text-4xl font-bold text-orange-500">{result.chinese.kanji} {result.chinese.japaneseName}年</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{result.chinese.animal}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm font-semibold mb-2">{result.western.japaneseName}の性格</p>
              <div className="flex flex-wrap gap-1">
                {result.western.traits.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm font-semibold mb-2">{result.chinese.kanji}（{result.chinese.japaneseName}）年の性格</p>
              <div className="flex flex-wrap gap-1">
                {result.chinese.traits.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

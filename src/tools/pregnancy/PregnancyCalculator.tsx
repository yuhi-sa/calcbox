'use client';

import { useState } from 'react';
import { calculatePregnancy, PregnancyResult } from './pregnancy-logic';

export default function PregnancyCalculator() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [result, setResult] = useState<PregnancyResult | null>(null);

  const calculate = () => {
    if (!lastPeriod) {
      alert('最終月経開始日を入力してください。');
      return;
    }
    const lmpDate = new Date(lastPeriod);
    const today = new Date();
    if (lmpDate > today) {
      alert('最終月経開始日は今日以前の日付を入力してください。');
      return;
    }
    setResult(calculatePregnancy(lmpDate, today));
  };

  const reset = () => {
    setLastPeriod('');
    setResult(null);
  };

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">最終月経開始日</label>
          <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">現在の妊娠週数</p>
            <p className="text-4xl font-bold text-orange-500">{result.currentWeeks}週{result.currentDays}日</p>
            <p className="text-lg font-semibold mt-1 text-orange-400">{result.trimester}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">出産予定日</p>
              <p className="text-lg font-semibold">{formatDate(result.dueDate)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">残り日数</p>
              <p className="text-lg font-semibold">{result.daysRemaining} 日</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

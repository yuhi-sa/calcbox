'use client';

import { useState } from 'react';
import { calculateCalorie, CalorieResult, ACTIVITIES } from './calorie-logic';

export default function CalorieCalculator() {
  const [activityIndex, setActivityIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (!w || !d || w < 20 || w > 300 || d < 1 || d > 1440) {
      alert('体重（20〜300kg）と時間（1〜1440分）を正しく入力してください。');
      return;
    }
    setResult(calculateCalorie(activityIndex, w, d));
  };

  const reset = () => {
    setActivityIndex(0);
    setWeight('');
    setDuration('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">活動の種類</label>
          <select value={activityIndex} onChange={(e) => setActivityIndex(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {ACTIVITIES.map((a, i) => (
              <option key={i} value={i}>{a.name}（METs: {a.met}）</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">体重（kg）</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 65" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">時間（分）</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="例: 30" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">消費カロリー</p>
            <p className="text-4xl font-bold text-orange-500">{result.calories.toFixed(0)} kcal</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">活動</p>
              <p className="text-lg font-semibold">{result.activity}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">METs値</p>
              <p className="text-lg font-semibold">{result.met}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

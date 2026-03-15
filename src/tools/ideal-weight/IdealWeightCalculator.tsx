'use client';

import { useState } from 'react';
import { calculateIdealWeight, IdealWeightResult } from './ideal-weight-logic';

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState<IdealWeightResult | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const m = parseInt(months);
    if (!h || !w || !m || h < 100 || h > 250 || w < 20 || w > 300 || m < 1 || m > 24) {
      alert('身長（100〜250cm）、体重（20〜300kg）、目標期間（1〜24ヶ月）を正しく入力してください。');
      return;
    }
    setResult(calculateIdealWeight(h, w, m));
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setMonths('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">身長（cm）</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 170" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">現在の体重（kg）</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 70" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">目標期間（ヶ月）</label>
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="例: 3" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {result.targets.map((t, i) => (
            <div key={i} className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.label}</p>
              <p className="text-2xl font-bold text-orange-500">{t.weight.toFixed(1)} kg</p>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  現在との差: <span className={t.diff > 0 ? 'text-orange-500' : 'text-green-500'}>{t.diff > 0 ? '+' : ''}{t.diff.toFixed(1)} kg</span>
                </span>
                {t.dailyCalorieDeficit !== null && (
                  <span className="text-gray-500 dark:text-gray-400">
                    1日の削減目標: <span className="text-orange-500">{t.dailyCalorieDeficit.toFixed(0)} kcal</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

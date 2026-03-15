'use client';

import { useState } from 'react';
import { calculateHeartRateZones, HeartRateResult } from './heart-rate-logic';

const ZONE_COLORS = [
  'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
  'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
  'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
];

export default function HeartRateCalculator() {
  const [age, setAge] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [useKarvonen, setUseKarvonen] = useState(false);
  const [result, setResult] = useState<HeartRateResult | null>(null);

  const calculate = () => {
    const a = parseInt(age);
    if (!a || a < 10 || a > 120) {
      alert('年齢（10〜120歳）を正しく入力してください。');
      return;
    }
    if (useKarvonen) {
      const rhr = parseInt(restingHR);
      if (!rhr || rhr < 30 || rhr > 120) {
        alert('安静時心拍数（30〜120bpm）を正しく入力してください。');
        return;
      }
      setResult(calculateHeartRateZones({ age: a, restingHeartRate: rhr }));
    } else {
      setResult(calculateHeartRateZones({ age: a }));
    }
  };

  const reset = () => {
    setAge('');
    setRestingHR('');
    setUseKarvonen(false);
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">年齢</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 30" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="karvonen" checked={useKarvonen} onChange={(e) => setUseKarvonen(e.target.checked)} className="rounded" />
          <label htmlFor="karvonen" className="text-sm">カルボーネン法を使用（安静時心拍数を入力）</label>
        </div>
        {useKarvonen && (
          <div>
            <label className="block text-sm font-medium mb-1">安静時心拍数（bpm）</label>
            <input type="number" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} placeholder="例: 60" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">最大心拍数</p>
            <p className="text-4xl font-bold text-orange-500">{result.maxHeartRate} bpm</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              計算方法: {result.method === 'karvonen' ? 'カルボーネン法' : '標準法 (220 - 年齢)'}
            </p>
          </div>
          <div className="space-y-2">
            {result.zones.map((zone, i) => (
              <div key={zone.name} className={`p-3 rounded-lg border ${ZONE_COLORS[i]} flex justify-between items-center`}>
                <div>
                  <p className="text-sm font-semibold">Zone {i + 1}: {zone.nameJa}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{zone.name} ({zone.minPercent}-{zone.maxPercent}%)</p>
                </div>
                <p className="text-lg font-bold">{zone.minBpm} - {zone.maxBpm} bpm</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  calculateWaterIntake,
  WaterIntakeResult,
  ActivityLevel,
  Climate,
  ACTIVITY_LABELS,
  CLIMATE_LABELS,
} from './water-intake-logic';

const activityLevels: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const climates: Climate[] = ['cool', 'temperate', 'warm', 'hot'];

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [climate, setClimate] = useState<Climate>('temperate');
  const [result, setResult] = useState<WaterIntakeResult | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (!w || w < 20 || w > 300) {
      alert('体重（20〜300kg）を正しく入力してください。');
      return;
    }
    setResult(calculateWaterIntake({ weightKg: w, activityLevel, climate }));
  };

  const reset = () => {
    setWeight('');
    setActivityLevel('moderate');
    setClimate('temperate');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">体重（kg）</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 65" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">活動レベル</label>
          <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {activityLevels.map((level) => (
              <option key={level} value={level}>{ACTIVITY_LABELS[level]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">気候 / 季節</label>
          <select value={climate} onChange={(e) => setClimate(e.target.value as Climate)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {climates.map((c) => (
              <option key={c} value={c}>{CLIMATE_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">1日の推奨水分摂取量</p>
            <p className="text-4xl font-bold text-orange-500">{result.dailyMl.toLocaleString()} mL</p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">（約 {result.dailyCups} カップ）</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">活動レベル</p>
              <p className="text-lg font-semibold">{ACTIVITY_LABELS[result.activityLevel]}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">気候</p>
              <p className="text-lg font-semibold">{CLIMATE_LABELS[result.climate]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

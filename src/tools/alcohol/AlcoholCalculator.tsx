'use client';

import { useState } from 'react';
import { calculateAlcohol, AlcoholResult, DRINK_PRESETS } from './alcohol-logic';

export default function AlcoholCalculator() {
  const [drinkIndex, setDrinkIndex] = useState(0);
  const [customPercentage, setCustomPercentage] = useState('');
  const [volume, setVolume] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<AlcoholResult | null>(null);

  const currentPreset = DRINK_PRESETS[drinkIndex];
  const isCustom = currentPreset.name === 'カスタム';

  const calculate = () => {
    const v = parseFloat(volume);
    const w = parseFloat(weight);
    const pct = isCustom ? parseFloat(customPercentage) : currentPreset.percentage;
    if (!v || !w || v < 1 || w < 20 || w > 300 || (!isCustom ? false : (!pct || pct < 0.1 || pct > 100))) {
      alert('入力値を正しく入力してください。');
      return;
    }
    setResult(calculateAlcohol(v, pct, w, new Date()));
  };

  const reset = () => {
    setDrinkIndex(0);
    setCustomPercentage('');
    setVolume('');
    setWeight('');
    setResult(null);
  };

  const formatTime = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}時間${m}分`;
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">お酒の種類</label>
          <select value={drinkIndex} onChange={(e) => setDrinkIndex(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {DRINK_PRESETS.map((d, i) => (
              <option key={i} value={i}>{d.name}{d.percentage > 0 ? `（${d.percentage}%）` : ''}</option>
            ))}
          </select>
        </div>
        {isCustom && (
          <div>
            <label className="block text-sm font-medium mb-1">アルコール度数（%）</label>
            <input type="number" value={customPercentage} onChange={(e) => setCustomPercentage(e.target.value)} placeholder="例: 9" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">飲酒量（ml）</label>
          <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="例: 500" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">体重（kg）</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 65" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">分解にかかる時間</p>
            <p className="text-4xl font-bold text-orange-500">{formatDuration(result.decompositionTimeHours)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">純アルコール量</p>
              <p className="text-lg font-semibold">{result.pureAlcoholGrams.toFixed(1)} g</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">分解速度</p>
              <p className="text-lg font-semibold">{result.decompositionRatePerHour.toFixed(1)} g/時</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">お酒が抜ける時刻</p>
              <p className="text-lg font-semibold">{formatTime(result.soberTime)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

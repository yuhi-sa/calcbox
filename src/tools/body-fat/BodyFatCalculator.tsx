'use client';

import { useState } from 'react';
import { calculateBodyFat, BodyFatResult, Gender } from './body-fat-logic';

export default function BodyFatCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [result, setResult] = useState<BodyFatResult | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    if (!h || !w || !a || h < 100 || h > 250 || w < 20 || w > 300 || a < 1 || a > 120) {
      alert('身長（100〜250cm）、体重（20〜300kg）、年齢（1〜120歳）を正しく入力してください。');
      return;
    }
    setResult(calculateBodyFat(h, w, a, gender));
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setGender('male');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">性別</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">身長（cm）</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 170" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">体重（kg）</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 65" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年齢</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 30" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">体脂肪率</p>
            <p className="text-4xl font-bold" style={{ color: result.category.color }}>{result.bodyFatPercentage.toFixed(1)}%</p>
            <p className="text-lg font-semibold mt-1" style={{ color: result.category.color }}>{result.category.label}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">BMI</p>
            <p className="text-lg font-semibold">{result.bmi.toFixed(1)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

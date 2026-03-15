'use client';

import { useState } from 'react';
import { calculateBmi, BmiResult } from './bmi-logic';

export default function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h < 100 || h > 250 || w < 20 || w > 300) {
      alert('身長（100〜250cm）と体重（20〜300kg）を正しく入力してください。');
      return;
    }
    setResult(calculateBmi(h, w));
  };

  const reset = () => {
    setHeight('');
    setWeight('');
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
            <p className="text-sm text-gray-600 dark:text-gray-400">BMI値</p>
            <p className="text-4xl font-bold" style={{ color: result.category.color }}>{result.bmi.toFixed(1)}</p>
            <p className="text-lg font-semibold mt-1" style={{ color: result.category.color }}>{result.category.label}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">適正体重</p>
              <p className="text-lg font-semibold">{result.idealWeight.toFixed(1)} kg</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">適正体重との差</p>
              <p className="text-lg font-semibold" style={{ color: result.weightDiff > 0 ? '#f59e0b' : result.weightDiff < 0 ? '#3b82f6' : '#22c55e' }}>
                {result.weightDiff > 0 ? '+' : ''}{result.weightDiff.toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

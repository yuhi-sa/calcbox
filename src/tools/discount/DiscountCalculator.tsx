'use client';

import { useState } from 'react';
import { calcDiscount, DiscountResult } from './discount-logic';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [result, setResult] = useState<DiscountResult | null>(null);

  const calculate = () => {
    const p = parseFloat(price);
    const r1 = parseFloat(rate1);
    if (isNaN(p) || p < 0 || isNaN(r1) || r1 < 0 || r1 > 100) {
      alert('価格と割引率を正しく入力してください。');
      return;
    }
    const r2 = rate2 ? parseFloat(rate2) : undefined;
    if (r2 !== undefined && (isNaN(r2) || r2 < 0 || r2 > 100)) {
      alert('2回目の割引率を正しく入力してください。');
      return;
    }
    setResult(calcDiscount(p, r1, r2));
  };

  const reset = () => {
    setPrice('');
    setRate1('');
    setRate2('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">元の価格（円）</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="例: 10000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">割引率（%）</label>
          <input type="number" value={rate1} onChange={(e) => setRate1(e.target.value)} placeholder="例: 20" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">2回目の割引率（%・任意）</label>
          <input type="number" value={rate2} onChange={(e) => setRate2(e.target.value)} placeholder="例: 10" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">割引後の価格</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{result.discountedPrice.toLocaleString()} 円</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">割引額</p>
              <p className="text-lg font-semibold text-red-500">-{result.savings.toLocaleString()} 円</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">実質割引率</p>
              <p className="text-lg font-semibold">{result.effectiveRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

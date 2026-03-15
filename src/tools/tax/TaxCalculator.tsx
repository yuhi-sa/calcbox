'use client';

import { useState } from 'react';
import { calculateTax, TaxResult } from './tax-logic';

function formatYen(val: number): string {
  return Math.floor(val).toLocaleString() + '円';
}

export default function TaxCalculator() {
  const [price, setPrice] = useState('');
  const [direction, setDirection] = useState<'exclude-to-include' | 'include-to-exclude'>('exclude-to-include');
  const [taxRate, setTaxRate] = useState(0.10);
  const [result, setResult] = useState<TaxResult | null>(null);

  const calculate = () => {
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) {
      alert('金額を正しく入力してください。');
      return;
    }
    setResult(calculateTax(p, taxRate, direction));
  };

  const reset = () => {
    setPrice('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">計算方向</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={direction === 'exclude-to-include'} onChange={() => setDirection('exclude-to-include')} />
              税抜 → 税込
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={direction === 'include-to-exclude'} onChange={() => setDirection('include-to-exclude')} />
              税込 → 税抜
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">税率</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={taxRate === 0.10} onChange={() => setTaxRate(0.10)} />
              10%
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={taxRate === 0.08} onChange={() => setTaxRate(0.08)} />
              8%（軽減税率）
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {direction === 'exclude-to-include' ? '税抜価格（円）' : '税込価格（円）'}
          </label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="例: 1000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">{result.resultPriceLabel}</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{formatYen(result.resultPrice)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">消費税額</p>
              <p className="text-lg font-semibold">{formatYen(result.taxAmount)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">{result.originalPriceLabel}</p>
              <p className="text-lg font-semibold">{formatYen(result.originalPrice)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

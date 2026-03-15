'use client';

import { useState } from 'react';
import { calculateTip, TipResult } from './tip-logic';

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<TipResult | null>(null);

  const presets = [10, 15, 18, 20, 25];

  const calculate = () => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent);
    const p = parseInt(people);
    if (!b || b <= 0 || isNaN(t) || t < 0) {
      alert('請求額とチップ率を正しく入力してください。');
      return;
    }
    setResult(calculateTip(b, t, p || 1));
  };

  const reset = () => {
    setBill('');
    setTipPercent('15');
    setPeople('1');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">請求額（Bill Amount）</label>
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="例: 5000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">チップ率（%）</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {presets.map((p) => (
              <button key={p} onClick={() => setTipPercent(String(p))} className={`px-3 py-1 rounded-lg text-sm font-medium ${tipPercent === String(p) ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {p}%
              </button>
            ))}
          </div>
          <input type="number" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} placeholder="15" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">人数</label>
          <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} placeholder="1" min="1" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">合計（Total）</p>
            <p className="text-4xl font-bold">{result.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">チップ額</p>
              <p className="text-lg font-semibold">{result.tipAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">1人あたり</p>
              <p className="text-lg font-semibold">{result.perPerson.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

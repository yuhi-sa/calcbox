'use client';

import { useState } from 'react';
import { calcElectricity, ElectricityResult, DEFAULT_UNIT_PRICE } from './electricity-logic';

export default function ElectricityCalculator() {
  const [wattage, setWattage] = useState('');
  const [hours, setHours] = useState('');
  const [unitPrice, setUnitPrice] = useState(String(DEFAULT_UNIT_PRICE));
  const [result, setResult] = useState<ElectricityResult | null>(null);

  const calculate = () => {
    const w = parseFloat(wattage);
    const h = parseFloat(hours);
    const p = parseFloat(unitPrice);
    if (isNaN(w) || w < 0 || isNaN(h) || h < 0 || h > 24 || isNaN(p) || p < 0) {
      alert('入力値を正しく入力してください。');
      return;
    }
    setResult(calcElectricity(w, h, p));
  };

  const reset = () => {
    setWattage('');
    setHours('');
    setUnitPrice(String(DEFAULT_UNIT_PRICE));
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">消費電力（W）</label>
          <input type="number" value={wattage} onChange={(e) => setWattage(e.target.value)} placeholder="例: 1000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">1日の使用時間（時間）</label>
          <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="例: 8" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">電気料金単価（円/kWh）</label>
          <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="例: 31" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">1日あたり</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{result.dailyKwh.toFixed(2)} kWh</p>
              <p className="text-xl font-bold">{Math.round(result.dailyCost).toLocaleString()} 円</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">1ヶ月あたり</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{result.monthlyKwh.toFixed(2)} kWh</p>
              <p className="text-xl font-bold">{Math.round(result.monthlyCost).toLocaleString()} 円</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">1年あたり</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{result.yearlyKwh.toFixed(2)} kWh</p>
              <p className="text-xl font-bold">{Math.round(result.yearlyCost).toLocaleString()} 円</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { calculateFuelCost, calculateDistanceFromBudget, FuelCostResult, FuelBudgetResult } from './fuel-cost-logic';

export default function FuelCostCalculator() {
  const [mode, setMode] = useState<'cost' | 'budget'>('cost');
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [fuelPrice, setFuelPrice] = useState('170');
  const [budget, setBudget] = useState('');
  const [costResult, setCostResult] = useState<FuelCostResult | null>(null);
  const [budgetResult, setBudgetResult] = useState<FuelBudgetResult | null>(null);

  const calculate = () => {
    const eff = parseFloat(efficiency);
    const price = parseFloat(fuelPrice);
    if (!eff || !price || eff <= 0 || price <= 0) {
      alert('燃費と燃料単価を正しく入力してください。');
      return;
    }

    if (mode === 'cost') {
      const dist = parseFloat(distance);
      if (!dist || dist <= 0) {
        alert('距離を正しく入力してください。');
        return;
      }
      setCostResult(calculateFuelCost(dist, eff, price));
      setBudgetResult(null);
    } else {
      const b = parseFloat(budget);
      if (!b || b <= 0) {
        alert('予算を正しく入力してください。');
        return;
      }
      setBudgetResult(calculateDistanceFromBudget(b, eff, price));
      setCostResult(null);
    }
  };

  const reset = () => {
    setDistance('');
    setEfficiency('');
    setFuelPrice('170');
    setBudget('');
    setCostResult(null);
    setBudgetResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('cost'); setCostResult(null); setBudgetResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'cost' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            距離からコスト計算
          </button>
          <button
            onClick={() => { setMode('budget'); setCostResult(null); setBudgetResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'budget' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            予算から距離計算
          </button>
        </div>

        {mode === 'cost' ? (
          <div>
            <label className="block text-sm font-medium mb-1">走行距離（km）</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="例: 100" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">予算（円）</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="例: 5000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">燃費（km/L）</label>
          <input type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} placeholder="例: 15" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">燃料単価（円/L）</label>
          <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} placeholder="例: 170" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {costResult && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">ガソリン代合計</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">&yen;{costResult.totalCost.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">必要燃料</p>
              <p className="text-lg font-semibold">{costResult.fuelNeeded} L</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">1kmあたりコスト</p>
              <p className="text-lg font-semibold">&yen;{costResult.costPerKm}</p>
            </div>
          </div>
        </div>
      )}

      {budgetResult && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">走行可能距離</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{budgetResult.maxDistance} km</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">使用可能燃料</p>
            <p className="text-lg font-semibold">{budgetResult.fuelUsable} L</p>
          </div>
        </div>
      )}
    </div>
  );
}

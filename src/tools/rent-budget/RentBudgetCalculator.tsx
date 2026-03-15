'use client';

import { useState } from 'react';
import { calculateRentBudget, RentBudgetResult } from './rent-budget-logic';

export default function RentBudgetCalculator() {
  const [income, setIncome] = useState('');
  const [isAnnual, setIsAnnual] = useState(false);
  const [includeBonus, setIncludeBonus] = useState(true);
  const [currentRent, setCurrentRent] = useState('');
  const [result, setResult] = useState<RentBudgetResult | null>(null);

  const calculate = () => {
    const inc = parseFloat(income);
    if (!inc || inc <= 0) {
      alert('収入を正しく入力してください。');
      return;
    }
    const rent = currentRent ? parseFloat(currentRent) : undefined;
    setResult(calculateRentBudget(inc, isAnnual, includeBonus, 2, rent));
  };

  const reset = () => {
    setIncome('');
    setIsAnnual(false);
    setIncludeBonus(true);
    setCurrentRent('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {isAnnual ? '年収（円）' : '月収（円）'}
          </label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder={isAnnual ? '例: 4800000' : '例: 300000'} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isAnnual} onChange={(e) => setIsAnnual(e.target.checked)} className="rounded" />
            年収で入力
          </label>
          {isAnnual && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={includeBonus} onChange={(e) => setIncludeBonus(e.target.checked)} className="rounded" />
              ボーナス込み
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">現在の家賃（円・任意）</label>
          <input type="number" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} placeholder="例: 80000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">適正家賃の目安</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              &yen;{result.recommendedMin.toLocaleString()} 〜 &yen;{result.recommendedMax.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">月収 &yen;{result.monthlyIncome.toLocaleString()} の25〜30%</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">光熱費の目安（月収の5%）</p>
            <p className="text-lg font-semibold">&yen;{result.utilitiesEstimate.toLocaleString()}</p>
          </div>

          {result.warning && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{result.warning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

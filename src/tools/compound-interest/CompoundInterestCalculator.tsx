'use client';

import { useState } from 'react';
import { calcCompoundInterest, CompoundInterestResult } from './compound-interest-logic';

function formatYen(val: number): string {
  return Math.round(val).toLocaleString() + '円';
}

function formatMan(val: number): string {
  const man = val / 10000;
  if (man >= 1) {
    return Math.round(val).toLocaleString() + '円（約' + man.toFixed(1) + '万円）';
  }
  return Math.round(val).toLocaleString() + '円';
}

export default function CompoundInterestCalculator() {
  const [initialAmount, setInitialAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  const calculate = () => {
    const init = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualRate);
    const y = parseInt(years, 10);

    if (isNaN(rate) || rate < 0 || rate > 100 || !y || y < 1 || y > 100) {
      alert('入力値を確認してください。');
      return;
    }

    setResult(calcCompoundInterest(init, monthly, rate, y));
    setShowTable(false);
  };

  const reset = () => {
    setInitialAmount('');
    setMonthlyContribution('');
    setAnnualRate('');
    setYears('');
    setResult(null);
    setShowTable(false);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">初期投資額（円）</label>
          <input type="number" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} placeholder="例: 1000000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">毎月の積立額（円）</label>
          <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} placeholder="例: 30000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年利（%）</label>
          <input type="number" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} placeholder="例: 5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">運用期間（年）</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="例: 20" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">最終資産額</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{formatMan(result.finalAmount)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">総投資額</p>
              <p className="text-lg font-semibold">{formatMan(result.totalContributions)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">運用益</p>
              <p className="text-lg font-semibold">{formatMan(result.totalInterest)}</p>
            </div>
          </div>

          <button onClick={() => setShowTable(!showTable)} className="text-sm text-[var(--color-primary)] hover:underline">
            {showTable ? '年次推移を隠す' : '年次推移を表示'}
          </button>

          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="py-2 px-2 text-left">年</th>
                    <th className="py-2 px-2 text-right">資産額</th>
                    <th className="py-2 px-2 text-right">投資累計</th>
                    <th className="py-2 px-2 text-right">運用益累計</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((d) => (
                    <tr key={d.year} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 px-2 font-medium">{d.year}年目</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.balance)}</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.contributions)}</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

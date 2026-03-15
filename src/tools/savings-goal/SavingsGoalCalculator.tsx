'use client';

import { useState } from 'react';
import { calculateSavingsGoal, SavingsGoalResult } from './savings-goal-logic';

export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [result, setResult] = useState<SavingsGoalResult | null>(null);

  const calculate = () => {
    const goal = parseFloat(goalAmount);
    const current = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyDeposit);
    const rate = parseFloat(interestRate) || 0;

    if (!goal || goal <= 0) {
      alert('目標金額を正しく入力してください。');
      return;
    }
    if (!monthly || monthly <= 0) {
      alert('毎月の積立額を正しく入力してください。');
      return;
    }
    if (rate < 0 || rate > 100) {
      alert('金利（0〜100%）を正しく入力してください。');
      return;
    }

    setResult(calculateSavingsGoal({
      goalAmount: goal,
      currentSavings: current,
      monthlyDeposit: monthly,
      annualInterestRate: rate,
    }));
  };

  const reset = () => {
    setGoalAmount('');
    setCurrentSavings('');
    setMonthlyDeposit('');
    setInterestRate('');
    setResult(null);
  };

  const formatYen = (amount: number) => {
    return amount.toLocaleString() + ' 円';
  };

  // Simple bar chart using progress data
  const maxBalance = result ? Math.max(...result.progressData.map((d) => d.balance), 1) : 1;

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">目標金額（円）</label>
          <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="例: 1000000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">現在の貯金額（円）</label>
          <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} placeholder="例: 100000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">毎月の積立額（円）</label>
          <input type="number" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(e.target.value)} placeholder="例: 50000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年利（%）</label>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="例: 3" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">目標達成まで</p>
            <p className="text-4xl font-bold text-orange-500">
              {result.monthsToGoal >= 12
                ? `${result.yearsToGoal} 年`
                : `${result.monthsToGoal} ヶ月`}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              （{result.monthsToGoal} ヶ月）
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">総積立額</p>
              <p className="text-lg font-semibold">{formatYen(result.totalDeposited)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">利息合計</p>
              <p className="text-lg font-semibold">{formatYen(result.totalInterestEarned)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">最終金額</p>
              <p className="text-lg font-semibold">{formatYen(result.finalAmount)}</p>
            </div>
          </div>

          {/* Progress chart */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm font-medium mb-3">貯蓄推移</p>
            <div className="space-y-1">
              {result.progressData.filter((_, i) => i > 0).slice(0, 20).map((point) => (
                <div key={point.month} className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-right text-gray-500 dark:text-gray-400 shrink-0">
                    {point.month >= 12 ? `${Math.floor(point.month / 12)}年${point.month % 12 ? point.month % 12 + '月' : ''}` : `${point.month}月`}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-orange-400 dark:bg-orange-500 rounded-full transition-all"
                      style={{ width: `${(point.balance / maxBalance) * 100}%` }}
                    />
                  </div>
                  <span className="w-24 text-right text-gray-600 dark:text-gray-300 shrink-0">
                    {point.balance.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

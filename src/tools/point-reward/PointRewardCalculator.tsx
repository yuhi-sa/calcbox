'use client';

import { useState } from 'react';
import { calcPointReward, PointRewardResult } from './point-reward-logic';

function formatYen(val: number): string {
  return Math.round(val).toLocaleString() + '円';
}

export default function PointRewardCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [rewardRate, setRewardRate] = useState('');
  const [pointValue, setPointValue] = useState('1');
  const [result, setResult] = useState<PointRewardResult | null>(null);

  const calculate = () => {
    const amount = parseFloat(purchaseAmount);
    const rate = parseFloat(rewardRate);
    const pv = parseFloat(pointValue) || 1;

    if (!amount || amount <= 0 || isNaN(rate) || rate < 0 || rate > 100) {
      alert('入力値を確認してください。');
      return;
    }

    setResult(calcPointReward(amount, rate, pv));
  };

  const reset = () => {
    setPurchaseAmount('');
    setRewardRate('');
    setPointValue('1');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">購入金額（円）</label>
          <input type="number" value={purchaseAmount} onChange={(e) => setPurchaseAmount(e.target.value)} placeholder="例: 10000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">還元率（%）</label>
          <input type="number" step="0.1" value={rewardRate} onChange={(e) => setRewardRate(e.target.value)} placeholder="例: 1.5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">1ポイントの価値（円）</label>
          <input type="number" step="0.1" value={pointValue} onChange={(e) => setPointValue(e.target.value)} placeholder="例: 1" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">獲得ポイント</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{result.pointsEarned.toLocaleString()} ポイント</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">実質割引額</p>
              <p className="text-lg font-semibold">{formatYen(result.effectiveDiscount)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">実質支払額</p>
              <p className="text-lg font-semibold">{formatYen(result.effectivePrice)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

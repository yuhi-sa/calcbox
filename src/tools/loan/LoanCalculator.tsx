'use client';

import { useState } from 'react';
import { calcLoan, LoanResult } from './loan-logic';

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

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [method, setMethod] = useState<'equal-payment' | 'equal-principal'>('equal-payment');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState('');

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseInt(years, 10);

    if (!a || a <= 0) {
      setError('借入金額は0より大きい値を入力してください。');
      setResult(null);
      return;
    }
    if (isNaN(r) || r < 0 || r > 50) {
      setError('年利は0〜50%の範囲で入力してください。');
      setResult(null);
      return;
    }
    if (!y || y < 1 || y > 50) {
      setError('返済期間は1〜50年の範囲で入力してください。');
      setResult(null);
      return;
    }

    setError('');
    setResult(calcLoan(a, r, y, method));
    setShowTable(false);
  };

  const reset = () => {
    setAmount('');
    setRate('');
    setYears('');
    setResult(null);
    setShowTable(false);
    setError('');
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">借入金額（万円）</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="例: 3000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年利（%）</label>
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="例: 1.5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">返済期間（年）</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="例: 35" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">返済方式</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="method" checked={method === 'equal-payment'} onChange={() => setMethod('equal-payment')} />
              元利均等返済
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="method" checked={method === 'equal-principal'} onChange={() => setMethod('equal-principal')} />
              元金均等返済
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">{result.monthlyLabel}</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{result.monthlyDisplay}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">総返済額</p>
              <p className="text-lg font-semibold">{formatMan(result.totalPayment)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">総利息</p>
              <p className="text-lg font-semibold">{formatMan(result.totalInterest)}</p>
            </div>
          </div>

          <button onClick={() => setShowTable(!showTable)} className="text-sm text-[var(--color-primary)] hover:underline">
            {showTable ? '返済予定表を隠す' : '返済予定表を表示'}
          </button>

          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="py-2 px-2 text-left">年</th>
                    <th className="py-2 px-2 text-right">返済額</th>
                    <th className="py-2 px-2 text-right">元金</th>
                    <th className="py-2 px-2 text-right">利息</th>
                    <th className="py-2 px-2 text-right">残高</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyData.map((d) => (
                    <tr key={d.year} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 px-2 font-medium">{d.year}年目</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.payment)}</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.principal)}</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.interest)}</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.balance)}</td>
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

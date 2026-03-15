'use client';

import { useState } from 'react';
import { calcHousingDeduction, HousingDeductionResult, HouseType } from './housing-deduction-logic';

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

export default function HousingDeductionCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [rate, setRate] = useState('');
  const [termYears, setTermYears] = useState('');
  const [houseType, setHouseType] = useState<HouseType>('general');
  const [result, setResult] = useState<HousingDeductionResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  const calculate = () => {
    const amount = parseFloat(loanAmount);
    const r = parseFloat(rate);
    const y = parseInt(termYears, 10);

    if (!amount || amount <= 0 || isNaN(r) || r < 0 || r > 20 || !y || y < 1 || y > 50) {
      alert('入力値を確認してください。');
      return;
    }

    setResult(calcHousingDeduction(amount * 10000, r, y, houseType));
    setShowTable(false);
  };

  const reset = () => {
    setLoanAmount('');
    setRate('');
    setTermYears('');
    setHouseType('general');
    setResult(null);
    setShowTable(false);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">借入金額（万円）</label>
          <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="例: 3000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年利（%）</label>
          <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="例: 1.0" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">返済期間（年）</label>
          <input type="number" value={termYears} onChange={(e) => setTermYears(e.target.value)} placeholder="例: 35" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">住宅タイプ</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="houseType" checked={houseType === 'general'} onChange={() => setHouseType('general')} />
              一般住宅
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="houseType" checked={houseType === 'energy-efficient'} onChange={() => setHouseType('energy-efficient')} />
              省エネ住宅
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">控除合計額（{result.maxDeductionYears}年間）</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{formatMan(result.totalDeduction)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">住宅タイプ</p>
              <p className="text-lg font-semibold">{result.houseTypeLabel}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">残高上限</p>
              <p className="text-lg font-semibold">{formatMan(result.balanceCap)}</p>
            </div>
          </div>

          <button onClick={() => setShowTable(!showTable)} className="text-sm text-[var(--color-primary)] hover:underline">
            {showTable ? '年次控除額を隠す' : '年次控除額を表示'}
          </button>

          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="py-2 px-2 text-left">年</th>
                    <th className="py-2 px-2 text-right">年末残高</th>
                    <th className="py-2 px-2 text-right">控除額</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyDeductions.map((d) => (
                    <tr key={d.year} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 px-2 font-medium">{d.year}年目</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.yearEndBalance)}</td>
                      <td className="py-2 px-2 text-right">{formatYen(d.deduction)}</td>
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

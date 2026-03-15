'use client';

import { useState } from 'react';
import { calcPension, PensionResult } from './pension-logic';

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

export default function PensionCalculator() {
  const [averageSalary, setAverageSalary] = useState('');
  const [nationalMonths, setNationalMonths] = useState('');
  const [employeeMonths, setEmployeeMonths] = useState('');
  const [result, setResult] = useState<PensionResult | null>(null);

  const calculate = () => {
    const salary = parseFloat(averageSalary);
    const natMonths = parseInt(nationalMonths, 10);
    const empMonths = parseInt(employeeMonths, 10);

    if (!salary || salary <= 0 || isNaN(natMonths) || natMonths < 0 || isNaN(empMonths) || empMonths < 0) {
      alert('入力値を確認してください。');
      return;
    }

    setResult(calcPension(salary * 10000, natMonths, empMonths));
  };

  const reset = () => {
    setAverageSalary('');
    setNationalMonths('');
    setEmployeeMonths('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">平均月収（万円）</label>
          <input type="number" value={averageSalary} onChange={(e) => setAverageSalary(e.target.value)} placeholder="例: 35" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">国民年金加入月数</label>
          <input type="number" value={nationalMonths} onChange={(e) => setNationalMonths(e.target.value)} placeholder="例: 480（40年）" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">厚生年金加入月数</label>
          <input type="number" value={employeeMonths} onChange={(e) => setEmployeeMonths(e.target.value)} placeholder="例: 420（35年）" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">年金受給額（年額）</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{formatMan(result.totalYearly)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">月額: {formatYen(result.totalMonthly)}</p>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">国民年金（基礎年金）</p>
              <p className="text-lg font-semibold">{formatYen(result.nationalPensionYearly)} / 年</p>
              <p className="text-sm text-gray-400">月額: {formatYen(result.nationalPensionMonthly)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">厚生年金</p>
              <p className="text-lg font-semibold">{formatYen(result.employeePensionYearly)} / 年</p>
              <p className="text-sm text-gray-400">月額: {formatYen(result.employeePensionMonthly)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">※ 上記は簡易的な試算です。実際の受給額は加入状況等により異なります。</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { calcFurusatoTax, FurusatoTaxResult, FamilyType } from './furusato-tax-logic';

function formatYen(val: number): string {
  return Math.round(val).toLocaleString() + '円';
}

export default function FurusatoTaxCalculator() {
  const [income, setIncome] = useState('');
  const [familyType, setFamilyType] = useState<FamilyType>('single');
  const [result, setResult] = useState<FurusatoTaxResult | null>(null);

  const calculate = () => {
    const inc = parseFloat(income);
    if (!inc || inc <= 0) {
      alert('年収を入力してください。');
      return;
    }
    setResult(calcFurusatoTax(inc * 10000, familyType));
  };

  const reset = () => {
    setIncome('');
    setFamilyType('single');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">年収（万円）</label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="例: 500" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">家族構成</label>
          <select value={familyType} onChange={(e) => setFamilyType(e.target.value as FamilyType)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            <option value="single">独身</option>
            <option value="married">夫婦（配偶者控除あり）</option>
            <option value="married_1child">夫婦+子1人</option>
            <option value="married_2children">夫婦+子2人</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">控除上限額（目安）</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{formatYen(result.maxDeduction)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">自己負担額</p>
              <p className="text-lg font-semibold">{formatYen(result.selfBurden)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">実質お得額</p>
              <p className="text-lg font-semibold">{formatYen(result.effectiveBenefit)}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">条件</p>
            <p className="text-sm">年収: {result.incomeLabel} / 家族構成: {result.familyLabel}</p>
          </div>
          <p className="text-xs text-gray-400">※ 上記は簡易的な目安です。正確な金額は各自治体や税理士にご確認ください。</p>
        </div>
      )}
    </div>
  );
}

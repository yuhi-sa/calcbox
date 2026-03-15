'use client';

import { useState } from 'react';
import { calculateRetirementPay, RetirementPayResult, RetirementType } from './retirement-pay-logic';

export default function RetirementPayEstimator() {
  const [salary, setSalary] = useState('');
  const [years, setYears] = useState('');
  const [retirementType, setRetirementType] = useState<RetirementType>('定年');
  const [result, setResult] = useState<RetirementPayResult | null>(null);

  const calculate = () => {
    const s = parseInt(salary);
    const y = parseInt(years);
    if (!s || !y || s < 10000 || s > 10000000 || y < 1 || y > 50) {
      alert('月給（1万〜1000万円）と勤続年数（1〜50年）を正しく入力してください。');
      return;
    }
    setResult(calculateRetirementPay(s, y, retirementType));
  };

  const reset = () => {
    setSalary('');
    setYears('');
    setRetirementType('定年');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">月給（円）</label>
          <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="例: 300000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">勤続年数</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="例: 20" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">退職事由</label>
          <select
            value={retirementType}
            onChange={(e) => setRetirementType(e.target.value as RetirementType)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="定年">定年退職</option>
            <option value="会社都合">会社都合退職</option>
            <option value="自己都合">自己都合退職</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">退職金（税引前）</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{result.displayGross}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">退職事由</p>
              <p className="text-base font-semibold">{result.retirementType}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">支給係数</p>
              <p className="text-base font-semibold">{result.coefficient} × {result.typeMultiplier}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">退職所得控除額</p>
              <p className="text-base font-semibold">{result.taxDeduction.toLocaleString()}円</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">課税退職所得</p>
              <p className="text-base font-semibold">{result.taxableIncome.toLocaleString()}円</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">概算税額</p>
              <p className="text-base font-semibold text-red-500">-{result.estimatedTax.toLocaleString()}円</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">手取り概算</p>
              <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{result.displayNet}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">※ 概算値です。実際の退職金は会社の規定により異なります。</p>
        </div>
      )}
    </div>
  );
}

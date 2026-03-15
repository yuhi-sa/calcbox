'use client';

import { useState } from 'react';
import { calcLoanCompare, LoanCompareResult } from './loan-compare-logic';

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

interface LoanForm {
  principal: string;
  rate: string;
  term: string;
}

export default function LoanCompareCalculator() {
  const [loanCount, setLoanCount] = useState(2);
  const [loans, setLoans] = useState<LoanForm[]>([
    { principal: '', rate: '', term: '' },
    { principal: '', rate: '', term: '' },
    { principal: '', rate: '', term: '' },
  ]);
  const [result, setResult] = useState<LoanCompareResult | null>(null);

  const updateLoan = (index: number, field: keyof LoanForm, value: string) => {
    const updated = [...loans];
    updated[index] = { ...updated[index], [field]: value };
    setLoans(updated);
  };

  const calculate = () => {
    const inputs = loans.slice(0, loanCount).map((l) => ({
      principal: (parseFloat(l.principal) || 0) * 10000,
      annualRate: parseFloat(l.rate) || 0,
      termYears: parseInt(l.term, 10) || 0,
    }));

    const valid = inputs.every((i) => i.principal > 0 && i.annualRate >= 0 && i.termYears > 0);
    if (!valid) {
      alert('すべてのローン情報を正しく入力してください。');
      return;
    }

    setResult(calcLoanCompare(inputs));
  };

  const reset = () => {
    setLoans([
      { principal: '', rate: '', term: '' },
      { principal: '', rate: '', term: '' },
      { principal: '', rate: '', term: '' },
    ]);
    setResult(null);
  };

  const labels = ['ローンA', 'ローンB', 'ローンC'];

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">比較するローン数</label>
          <select value={loanCount} onChange={(e) => { setLoanCount(parseInt(e.target.value, 10)); setResult(null); }} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            <option value={2}>2つ</option>
            <option value={3}>3つ</option>
          </select>
        </div>

        {loans.slice(0, loanCount).map((loan, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
            <p className="text-sm font-semibold">{labels[i]}</p>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">借入金額（万円）</label>
              <input type="number" value={loan.principal} onChange={(e) => updateLoan(i, 'principal', e.target.value)} placeholder="例: 3000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">年利（%）</label>
              <input type="number" step="0.01" value={loan.rate} onChange={(e) => updateLoan(i, 'rate', e.target.value)} placeholder="例: 1.5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">返済期間（年）</label>
              <input type="number" value={loan.term} onChange={(e) => updateLoan(i, 'term', e.target.value)} placeholder="例: 35" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">比較する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="py-2 px-2 text-left"></th>
                  {result.entries.map((e, i) => (
                    <th key={i} className={`py-2 px-2 text-right ${e.isBest ? 'text-[var(--color-primary)]' : ''}`}>
                      {labels[i]}{e.isBest ? ' ★' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2 font-medium">借入金額</td>
                  {result.entries.map((e, i) => (
                    <td key={i} className="py-2 px-2 text-right">{formatMan(e.principal)}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2 font-medium">年利</td>
                  {result.entries.map((e, i) => (
                    <td key={i} className="py-2 px-2 text-right">{e.annualRate}%</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2 font-medium">返済期間</td>
                  {result.entries.map((e, i) => (
                    <td key={i} className="py-2 px-2 text-right">{e.termYears}年</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2 font-medium">毎月の返済額</td>
                  {result.entries.map((e, i) => (
                    <td key={i} className={`py-2 px-2 text-right ${e.isBest ? 'font-bold text-[var(--color-primary)]' : ''}`}>{formatYen(e.monthlyPayment)}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2 font-medium">総返済額</td>
                  {result.entries.map((e, i) => (
                    <td key={i} className={`py-2 px-2 text-right ${e.isBest ? 'font-bold text-[var(--color-primary)]' : ''}`}>{formatMan(e.totalPayment)}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2 font-medium">総利息</td>
                  {result.entries.map((e, i) => (
                    <td key={i} className={`py-2 px-2 text-right ${e.isBest ? 'font-bold text-[var(--color-primary)]' : ''}`}>{formatMan(e.totalInterest)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm">★ <span className="font-semibold">{labels[result.bestIndex]}</span> が総返済額で最もお得です</p>
          </div>
        </div>
      )}
    </div>
  );
}

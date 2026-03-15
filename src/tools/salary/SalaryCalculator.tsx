'use client';

import { useState } from 'react';
import { calculateSalary, SalaryResult } from './salary-logic';

function formatYen(val: number): string {
  return Math.floor(val).toLocaleString() + '円';
}

export default function SalaryCalculator() {
  const [salaryInput, setSalaryInput] = useState('');
  const [inputType, setInputType] = useState<'annual' | 'monthly'>('annual');
  const [age, setAge] = useState('');
  const [dependents, setDependents] = useState('0');
  const [result, setResult] = useState<SalaryResult | null>(null);

  const calculate = () => {
    const salary = parseFloat(salaryInput);
    const ageVal = parseInt(age, 10);
    const deps = parseInt(dependents, 10) || 0;

    if (isNaN(salary) || salary < 0) { alert('額面金額を正しく入力してください。'); return; }
    if (isNaN(ageVal) || ageVal < 18 || ageVal > 100) { alert('年齢を正しく入力してください（18〜100）。'); return; }

    const annualGross = inputType === 'annual' ? salary : salary * 12;
    setResult(calculateSalary(annualGross, ageVal, deps));
  };

  const reset = () => {
    setSalaryInput(''); setAge(''); setDependents('0'); setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">入力タイプ</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={inputType === 'annual'} onChange={() => setInputType('annual')} /> 年収
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={inputType === 'monthly'} onChange={() => setInputType('monthly')} /> 月収
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{inputType === 'annual' ? '額面年収（円）' : '額面月収（円）'}</label>
          <input type="number" value={salaryInput} onChange={(e) => setSalaryInput(e.target.value)} placeholder={inputType === 'annual' ? '例: 4000000' : '例: 300000'} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">年齢</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 30" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">扶養人数</label>
          <input type="number" min="0" value={dependents} onChange={(e) => setDependents(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">年間手取り</p>
                <p className="text-xl font-bold text-[var(--color-primary)]">{formatYen(result.annualNet)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">月間手取り</p>
                <p className="text-xl font-bold text-[var(--color-primary)]">{formatYen(result.monthlyNet)}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700"><td className="py-2 font-medium">額面年収</td><td className="py-2 text-right">{formatYen(result.annualGross)}</td></tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><td className="py-2 pl-4">健康保険料</td><td className="py-2 text-right">{formatYen(result.healthInsurance)}</td></tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><td className="py-2 pl-4">厚生年金</td><td className="py-2 text-right">{formatYen(result.pension)}</td></tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><td className="py-2 pl-4">雇用保険</td><td className="py-2 text-right">{formatYen(result.employmentInsurance)}</td></tr>
                {result.nursingInsurance > 0 && (
                  <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><td className="py-2 pl-4">介護保険</td><td className="py-2 text-right">{formatYen(result.nursingInsurance)}</td></tr>
                )}
                <tr className="border-b border-gray-200 dark:border-gray-600 font-semibold"><td className="py-2">社会保険料合計</td><td className="py-2 text-right">{formatYen(result.socialInsuranceTotal)}</td></tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><td className="py-2 pl-4">所得税</td><td className="py-2 text-right">{formatYen(result.incomeTax)}</td></tr>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><td className="py-2 pl-4">住民税</td><td className="py-2 text-right">{formatYen(result.residentTax)}</td></tr>
                <tr className="border-b border-gray-200 dark:border-gray-600 font-semibold"><td className="py-2">税金合計</td><td className="py-2 text-right">{formatYen(result.taxTotal)}</td></tr>
                <tr className="font-bold text-[var(--color-primary)]"><td className="py-2">控除合計</td><td className="py-2 text-right">{formatYen(result.deductionTotal)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

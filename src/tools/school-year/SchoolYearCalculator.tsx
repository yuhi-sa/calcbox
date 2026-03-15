'use client';

import { useState } from 'react';
import { calculateSchoolYears, SchoolYearResult } from './school-year-logic';

export default function SchoolYearCalculator() {
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [result, setResult] = useState<SchoolYearResult | null>(null);

  const calculate = () => {
    const y = parseInt(birthYear);
    const m = parseInt(birthMonth);
    const d = parseInt(birthDay);
    if (!y || !m || !d || y < 1950 || y > 2030 || m < 1 || m > 12 || d < 1 || d > 31) {
      alert('正しい生年月日を入力してください。');
      return;
    }
    setResult(calculateSchoolYears(y, m, d));
  };

  const reset = () => {
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">生年（西暦）</label>
            <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="例: 2018" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">月</label>
            <input type="number" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} placeholder="例: 4" min="1" max="12" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">日</label>
            <input type="number" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} placeholder="例: 1" min="1" max="31" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">生年月日</p>
            <p className="text-xl font-bold">{result.birthDate}</p>
          </div>
          <div className="space-y-3">
            {result.milestones.map((m) => (
              <div key={m.label} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{m.label}</p>
                <p className="text-base font-semibold mt-1">{m.display}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

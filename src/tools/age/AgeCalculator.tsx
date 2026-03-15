'use client';

import { useState } from 'react';
import { calculateAge, AgeResult } from './age-logic';

export default function AgeCalculator() {
  const [birthday, setBirthday] = useState('');
  const [refDate, setRefDate] = useState('');
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculate = () => {
    const birth = new Date(birthday);
    if (isNaN(birth.getTime())) {
      alert('生年月日を正しく入力してください。');
      return;
    }
    const ref = refDate ? new Date(refDate) : new Date();
    if (isNaN(ref.getTime())) {
      alert('基準日を正しく入力してください。');
      return;
    }
    setResult(calculateAge(birth, ref));
  };

  const reset = () => {
    setBirthday('');
    setRefDate('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">生年月日</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">基準日（省略時は今日）</label>
          <input
            type="date"
            value={refDate}
            onChange={(e) => setRefDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">年齢</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {result.years}歳 {result.months}ヶ月 {result.days}日
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">生きた日数</p>
              <p className="text-lg font-semibold">{result.totalDays.toLocaleString()} 日</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">次の誕生日まで</p>
              <p className="text-lg font-semibold">{result.daysUntilNextBirthday} 日</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

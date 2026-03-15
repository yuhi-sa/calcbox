'use client';

import { useState } from 'react';
import { calcPartTimePay, PartTimePayResult, ShiftBasis } from './part-time-pay-logic';

function formatYen(val: number): string {
  return Math.round(val).toLocaleString() + '円';
}

export default function PartTimePayCalculator() {
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerShift, setHoursPerShift] = useState('');
  const [shiftsCount, setShiftsCount] = useState('');
  const [shiftBasis, setShiftBasis] = useState<ShiftBasis>('weekly');
  const [result, setResult] = useState<PartTimePayResult | null>(null);

  const calculate = () => {
    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerShift);
    const shifts = parseFloat(shiftsCount);

    if (!rate || rate <= 0 || !hours || hours <= 0 || !shifts || shifts <= 0) {
      alert('入力値を確認してください。');
      return;
    }

    setResult(calcPartTimePay(rate, hours, shifts, shiftBasis));
  };

  const reset = () => {
    setHourlyRate('');
    setHoursPerShift('');
    setShiftsCount('');
    setShiftBasis('weekly');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">時給（円）</label>
          <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="例: 1100" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">1回のシフト時間（時間）</label>
          <input type="number" step="0.5" value={hoursPerShift} onChange={(e) => setHoursPerShift(e.target.value)} placeholder="例: 5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">シフト回数</label>
          <div className="flex gap-2">
            <input type="number" value={shiftsCount} onChange={(e) => setShiftsCount(e.target.value)} placeholder={shiftBasis === 'weekly' ? '例: 3' : '例: 15'} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            <select value={shiftBasis} onChange={(e) => setShiftBasis(e.target.value as ShiftBasis)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              <option value="weekly">回/週</option>
              <option value="monthly">回/月</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">日給</p>
              <p className="text-lg font-semibold">{formatYen(result.dailyPay)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">週給</p>
              <p className="text-lg font-semibold">{formatYen(result.weeklyPay)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">月収</p>
              <p className="text-lg font-semibold">{formatYen(result.monthlyPay)}</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">年収</p>
              <p className="text-lg font-bold text-[var(--color-primary)]">{formatYen(result.yearlyPay)}</p>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">扶養・税金の壁チェック</p>
              {result.warnings.map((w) => (
                <div key={w.wall} className={`p-3 rounded-lg text-sm ${w.exceeded ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'}`}>
                  <span className="font-medium">{w.wall}</span>（{formatYen(w.amount)}）：{w.exceeded ? '超過 - ' + w.message : '範囲内'}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { OvertimeInput, calculateOvertime, OvertimeResult } from './overtime-logic';

export default function OvertimeCalculator() {
  const [mode, setMode] = useState<'hourly' | 'monthly'>('hourly');
  const [hourlyRate, setHourlyRate] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [monthlyHours, setMonthlyHours] = useState('160');
  const [normalHours, setNormalHours] = useState('');
  const [lateNightHours, setLateNightHours] = useState('');
  const [holidayHours, setHolidayHours] = useState('');
  const [holidayLateNightHours, setHolidayLateNightHours] = useState('');
  const [result, setResult] = useState<OvertimeResult | null>(null);

  const calculate = () => {
    const input: OvertimeInput = {
      mode,
      hourlyRate: parseFloat(hourlyRate) || 0,
      monthlySalary: parseFloat(monthlySalary) || 0,
      monthlyHours: parseFloat(monthlyHours) || 160,
      normalHours: parseFloat(normalHours) || 0,
      lateNightHours: parseFloat(lateNightHours) || 0,
      holidayHours: parseFloat(holidayHours) || 0,
      holidayLateNightHours: parseFloat(holidayLateNightHours) || 0,
    };

    if (mode === 'hourly' && !input.hourlyRate) {
      alert('時給を入力してください。');
      return;
    }
    if (mode === 'monthly' && !input.monthlySalary) {
      alert('月給を入力してください。');
      return;
    }

    setResult(calculateOvertime(input));
  };

  const reset = () => {
    setHourlyRate('');
    setMonthlySalary('');
    setMonthlyHours('160');
    setNormalHours('');
    setLateNightHours('');
    setHolidayHours('');
    setHolidayLateNightHours('');
    setResult(null);
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm';

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">計算方式</label>
          <div className="flex gap-2">
            <button onClick={() => setMode('hourly')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'hourly' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>時給入力</button>
            <button onClick={() => setMode('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'monthly' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>月給入力</button>
          </div>
        </div>

        {mode === 'hourly' ? (
          <div>
            <label className="block text-sm font-medium mb-1">基本時給（円）</label>
            <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="例: 1500" className={inputClass} />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">月給（円）</label>
              <input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="例: 300000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">月間所定労働時間</label>
              <input type="number" value={monthlyHours} onChange={(e) => setMonthlyHours(e.target.value)} placeholder="160" className={inputClass} />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">通常残業（時間）</label>
            <input type="number" value={normalHours} onChange={(e) => setNormalHours(e.target.value)} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">深夜残業（時間）</label>
            <input type="number" value={lateNightHours} onChange={(e) => setLateNightHours(e.target.value)} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">休日残業（時間）</label>
            <input type="number" value={holidayHours} onChange={(e) => setHolidayHours(e.target.value)} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">休日深夜（時間）</label>
            <input type="number" value={holidayLateNightHours} onChange={(e) => setHolidayLateNightHours(e.target.value)} placeholder="0" className={inputClass} />
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
            <p className="text-sm text-gray-600 dark:text-gray-400">残業代合計</p>
            <p className="text-4xl font-bold">{result.totalOvertimePay.toLocaleString()}円</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">基本時給: {result.baseHourlyRate.toLocaleString()}円</p>
          </div>

          <div className="space-y-2">
            {result.details.map((d) => (
              d.hours > 0 && (
                <div key={d.label} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{d.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{d.hours}h x {d.hourlyAmount.toLocaleString()}円</p>
                  </div>
                  <p className="text-lg font-semibold">{d.subtotal.toLocaleString()}円</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

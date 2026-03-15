'use client';

import { useState } from 'react';
import { dateDiff, addDays, DateDiffResult, AddDaysResult } from './days-logic';

export default function DaysCalculator() {
  const [mode, setMode] = useState<'diff' | 'add'>('diff');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysToAdd, setDaysToAdd] = useState('');
  const [diffResult, setDiffResult] = useState<DateDiffResult | null>(null);
  const [addResult, setAddResult] = useState<AddDaysResult | null>(null);

  const calculate = () => {
    try {
      if (mode === 'diff') {
        if (!startDate || !endDate) {
          alert('開始日と終了日を入力してください。');
          return;
        }
        const result = dateDiff(new Date(startDate), new Date(endDate));
        setDiffResult(result);
        setAddResult(null);
      } else {
        if (!startDate || !daysToAdd) {
          alert('基準日と日数を入力してください。');
          return;
        }
        const result = addDays(new Date(startDate), parseInt(daysToAdd));
        setAddResult(result);
        setDiffResult(null);
      }
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const reset = () => {
    setStartDate('');
    setEndDate('');
    setDaysToAdd('');
    setDiffResult(null);
    setAddResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">モード</label>
          <div className="flex gap-3">
            <button onClick={() => { setMode('diff'); reset(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'diff' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>日数差を計算</button>
            <button onClick={() => { setMode('add'); reset(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'add' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>日数を加算</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{mode === 'diff' ? '開始日' : '基準日'}</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>

        {mode === 'diff' ? (
          <div>
            <label className="block text-sm font-medium mb-1">終了日</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">加算する日数</label>
            <input type="number" value={daysToAdd} onChange={(e) => setDaysToAdd(e.target.value)} placeholder="例: 30（負の値も可）" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {diffResult && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">日数差</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{diffResult.days} 日</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">週</p>
              <p className="text-lg font-semibold">{diffResult.weeks.toFixed(1)} 週間</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">月</p>
              <p className="text-lg font-semibold">{diffResult.months} ヶ月</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">年</p>
              <p className="text-lg font-semibold">{diffResult.years.toFixed(1)} 年</p>
            </div>
          </div>
        </div>
      )}

      {addResult && (
        <div className="mt-6">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">結果の日付</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{addResult.formatted}</p>
          </div>
        </div>
      )}
    </div>
  );
}

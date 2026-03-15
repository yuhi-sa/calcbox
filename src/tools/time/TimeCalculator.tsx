'use client';

import { useState } from 'react';
import { parseTime, addTimes, subtractTimes, timeDifference, minutesToHours, hoursToMinutes, TimeResult } from './time-logic';

export default function TimeCalculator() {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'diff'>('add');
  const [result, setResult] = useState<TimeResult | null>(null);
  const [convMinutes, setConvMinutes] = useState('');
  const [convResult, setConvResult] = useState<string>('');

  const calculate = () => {
    const t1 = parseTime(time1);
    const t2 = parseTime(time2);
    if (!t1 || !t2) {
      alert('時間をHH:MM形式で入力してください。');
      return;
    }
    if (operation === 'add') setResult(addTimes(t1, t2));
    else if (operation === 'subtract') setResult(subtractTimes(t1, t2));
    else setResult(timeDifference(t1, t2));
  };

  const convertMinutes = () => {
    const m = parseInt(convMinutes, 10);
    if (isNaN(m) || m < 0) {
      alert('正の整数を入力してください。');
      return;
    }
    const r = minutesToHours(m);
    setConvResult(`${m}分 = ${r.formatted}`);
  };

  const reset = () => {
    setTime1('');
    setTime2('');
    setResult(null);
    setConvMinutes('');
    setConvResult('');
  };

  const opLabels = { add: '加算（＋）', subtract: '減算（−）', diff: '差分' };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">時間1（HH:MM）</label>
          <input type="text" value={time1} onChange={(e) => setTime1(e.target.value)} placeholder="例: 2:30" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">時間2（HH:MM）</label>
          <input type="text" value={time2} onChange={(e) => setTime2(e.target.value)} placeholder="例: 1:45" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">演算</label>
          <select value={operation} onChange={(e) => setOperation(e.target.value as 'add' | 'subtract' | 'diff')} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {Object.entries(opLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">結果</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{result.formatted}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">（{hoursToMinutes(result.hours, result.minutes)}分）</p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-semibold">分 → 時間 変換</h3>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">分数</label>
            <input type="number" value={convMinutes} onChange={(e) => setConvMinutes(e.target.value)} placeholder="例: 150" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <button onClick={convertMinutes} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換</button>
        </div>
        {convResult && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
            <p className="text-lg font-semibold">{convResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { calculateSleep, SleepResult, formatTime } from './sleep-logic';

export default function SleepCalculator() {
  const [mode, setMode] = useState<'wake' | 'bed'>('wake');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<SleepResult | null>(null);

  const calculate = () => {
    if (!time) {
      alert('時刻を入力してください。');
      return;
    }
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    setResult(calculateSleep(mode, date));
  };

  const reset = () => {
    setMode('wake');
    setTime('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">計算モード</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'wake' | 'bed')} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            <option value="wake">起床時刻から就寝時刻を計算</option>
            <option value="bed">就寝時刻から起床時刻を計算</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{mode === 'wake' ? '起床時刻' : '就寝時刻'}</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {result.mode === 'wake' ? 'おすすめの就寝時刻' : 'おすすめの起床時刻'}
          </p>
          {result.times.map((t, i) => (
            <div key={i} className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-orange-500">{formatTime(t.time)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.cycles} サイクル</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.hours} 時間</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

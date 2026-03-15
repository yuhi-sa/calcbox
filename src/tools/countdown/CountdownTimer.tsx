'use client';

import { useState, useEffect, useRef } from 'react';
import { calculateCountdown, formatCountdown, CountdownResult } from './countdown-logic';

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [result, setResult] = useState<CountdownResult | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (!targetDate) {
      alert('目標日付を入力してください。');
      return;
    }
    const dateTimeStr = targetTime ? `${targetDate}T${targetTime}` : `${targetDate}T00:00:00`;
    const target = new Date(dateTimeStr);
    if (isNaN(target.getTime())) {
      alert('日時を正しく入力してください。');
      return;
    }
    setRunning(true);

    const tick = () => {
      const r = calculateCountdown(new Date(), target);
      setResult(r);
      if (r.isExpired && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRunning(false);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    setResult(null);
    setTargetDate('');
    setTargetTime('');
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">目標日付</label>
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} disabled={running} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">目標時刻（省略時は00:00）</label>
          <input type="time" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} disabled={running} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={start} disabled={running} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">開始</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-6 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">残り時間</p>
          {result.isExpired ? (
            <p className="text-3xl font-bold text-red-500">終了</p>
          ) : (
            <div>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 font-mono">
                {formatCountdown(result)}
              </p>
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold">{result.days}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">日</p>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold">{result.hours}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">時間</p>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold">{result.minutes}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">分</p>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-700">
                  <p className="text-2xl font-bold">{result.seconds}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">秒</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

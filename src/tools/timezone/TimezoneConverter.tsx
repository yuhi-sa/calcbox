'use client';

import { useState } from 'react';
import { convertTimezone, TIMEZONES, ConvertedTime } from './timezone-logic';

export default function TimezoneConverter() {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [sourceId, setSourceId] = useState('JST');
  const [targetId, setTargetId] = useState('UTC');
  const [result, setResult] = useState<ConvertedTime | null>(null);

  const convert = () => {
    const h = parseInt(hours, 10);
    const m = parseInt(minutes || '0', 10);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      alert('時刻を正しく入力してください（0〜23時、0〜59分）。');
      return;
    }
    setResult(convertTimezone(h, m, sourceId, targetId));
  };

  const reset = () => {
    setHours('');
    setMinutes('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">時</label>
            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="例: 15" min="0" max="23" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">分</label>
            <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="例: 30" min="0" max="59" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">変換元タイムゾーン</label>
          <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>{tz.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">変換先タイムゾーン</label>
          <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>{tz.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={convert} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">変換結果</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{result.formatted}</p>
          {result.dateChangeLabel && (
            <p className="text-sm font-medium text-red-500 mt-1">（{result.dateChangeLabel}）</p>
          )}
        </div>
      )}
    </div>
  );
}

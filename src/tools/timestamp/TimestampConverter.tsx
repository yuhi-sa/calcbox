'use client';

import { useState, useEffect } from 'react';
import { formatDate, timestampToDate, dateToTimestamp, getCurrentTimestamp, getLocalISOString } from './timestamp-logic';
import { copyToClipboard } from '@/infrastructure/clipboard';
import { showToast } from '@/components/Toast';

export default function TimestampConverter() {
  const [currentTs, setCurrentTs] = useState(getCurrentTimestamp());
  const [tsInput, setTsInput] = useState('');
  const [tsUnit, setTsUnit] = useState<'s' | 'ms'>('s');
  const [tsResult, setTsResult] = useState('');
  const [dateInput, setDateInput] = useState(getLocalISOString(new Date()));
  const [dateResult, setDateResult] = useState<{ seconds: number; milliseconds: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTs(getCurrentTimestamp()), 1000);
    return () => clearInterval(timer);
  }, []);

  const copy = async (text: string) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? 'コピーしました' : 'コピーに失敗しました', ok ? 'success' : 'error');
  };

  const convertTsToDate = () => {
    const val = tsInput.trim();
    if (!val || isNaN(Number(val))) { setTsResult(''); return; }
    const date = timestampToDate(Number(val), tsUnit);
    if (!date) { setTsResult('無効なタイムスタンプです'); return; }
    setTsResult(formatDate(date) + ' (' + date.toISOString() + ')');
  };

  const convertDateToTs = () => {
    if (!dateInput) return;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return;
    setDateResult(dateToTimestamp(date));
  };

  const handleTsInputChange = (val: string) => {
    setTsInput(val);
    if (val.length >= 13) setTsUnit('ms');
    else if (val.length > 0 && val.length <= 10) setTsUnit('s');
  };

  return (
    <div className="space-y-8">
      {/* Current timestamp */}
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">現在のUnixタイムスタンプ</p>
        <p className="text-3xl font-mono font-bold text-[var(--color-primary)]">{currentTs}</p>
        <button onClick={() => copy(String(currentTs))} className="mt-2 text-xs text-[var(--color-primary)] hover:underline">コピー</button>
      </div>

      {/* Timestamp to Date */}
      <div>
        <h2 className="text-lg font-semibold mb-3">タイムスタンプ → 日時</h2>
        <div className="flex gap-2">
          <input type="text" value={tsInput} onChange={(e) => handleTsInputChange(e.target.value)} placeholder="例: 1700000000" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono" />
          <select value={tsUnit} onChange={(e) => setTsUnit(e.target.value as 's' | 'ms')} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            <option value="s">秒</option>
            <option value="ms">ミリ秒</option>
          </select>
          <button onClick={convertTsToDate} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換</button>
        </div>
        {tsResult && (
          <div className="mt-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 flex items-center justify-between">
            <code className="text-sm font-mono">{tsResult}</code>
            <button onClick={() => copy(tsResult)} className="text-xs text-[var(--color-primary)] hover:underline ml-2">コピー</button>
          </div>
        )}
      </div>

      {/* Date to Timestamp */}
      <div>
        <h2 className="text-lg font-semibold mb-3">日時 → タイムスタンプ</h2>
        <div className="flex gap-2">
          <input type="datetime-local" step="1" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          <button onClick={convertDateToTs} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換</button>
        </div>
        {dateResult && (
          <div className="mt-3 space-y-2">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
              <div><span className="text-xs text-gray-500">秒:</span> <code className="font-mono">{dateResult.seconds}</code></div>
              <button onClick={() => copy(String(dateResult.seconds))} className="text-xs text-[var(--color-primary)] hover:underline">コピー</button>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
              <div><span className="text-xs text-gray-500">ミリ秒:</span> <code className="font-mono">{dateResult.milliseconds}</code></div>
              <button onClick={() => copy(String(dateResult.milliseconds))} className="text-xs text-[var(--color-primary)] hover:underline">コピー</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

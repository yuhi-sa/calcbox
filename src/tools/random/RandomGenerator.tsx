'use client';

import { useState } from 'react';
import { generateRandomNumbers, pickFromList } from './random-logic';

export default function RandomGenerator() {
  const [mode, setMode] = useState<'number' | 'list'>('number');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [unique, setUnique] = useState(false);
  const [listInput, setListInput] = useState('');
  const [results, setResults] = useState<(number | string)[]>([]);

  const generate = () => {
    try {
      if (mode === 'number') {
        const nums = generateRandomNumbers(
          parseInt(min),
          parseInt(max),
          parseInt(count),
          unique
        );
        setResults(nums);
      } else {
        const items = listInput.split('\n').map((s) => s.trim()).filter(Boolean);
        const picked = pickFromList(items, parseInt(count) || 1);
        setResults(picked);
      }
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const reset = () => {
    setMin('1');
    setMax('100');
    setCount('1');
    setUnique(false);
    setListInput('');
    setResults([]);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">モード</label>
          <div className="flex gap-3">
            <button onClick={() => { setMode('number'); setResults([]); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'number' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>乱数生成</button>
            <button onClick={() => { setMode('list'); setResults([]); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>抽選</button>
          </div>
        </div>

        {mode === 'number' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">最小値</label>
                <input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">最大値</label>
                <input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">生成数</label>
              <input type="number" value={count} onChange={(e) => setCount(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="unique" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
              <label htmlFor="unique" className="text-sm font-medium">重複なし</label>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">リスト（1行に1つ）</label>
              <textarea value={listInput} onChange={(e) => setListInput(e.target.value)} placeholder={'山田\n佐藤\n田中'} rows={5} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">選択数</label>
              <input type="number" value={count} onChange={(e) => setCount(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button onClick={generate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">生成する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">結果</p>
            <div className="flex flex-wrap gap-2">
              {results.map((r, i) => (
                <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-lg font-bold border border-gray-200 dark:border-gray-600">
                  {String(r)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

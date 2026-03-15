'use client';

import { useState } from 'react';
import { westernToWareki, warekiToWestern, getEraNames, WarekiResult } from './wareki-logic';

export default function WarekiConverter() {
  const [mode, setMode] = useState<'toWareki' | 'toWestern'>('toWareki');
  const [westernYear, setWesternYear] = useState('');
  const [eraName, setEraName] = useState('令和');
  const [eraYear, setEraYear] = useState('');
  const [result, setResult] = useState<WarekiResult | null>(null);

  const convert = () => {
    if (mode === 'toWareki') {
      const y = parseInt(westernYear, 10);
      if (isNaN(y) || y < 1868) {
        alert('1868年以降の西暦を入力してください。');
        return;
      }
      setResult(westernToWareki(y));
    } else {
      const y = parseInt(eraYear, 10);
      if (isNaN(y) || y < 1) {
        alert('正しい年数を入力してください。');
        return;
      }
      const r = warekiToWestern(eraName, y);
      if (!r) {
        alert('その元号の範囲外です。');
        return;
      }
      setResult(r);
    }
  };

  const reset = () => {
    setWesternYear('');
    setEraYear('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('toWareki'); setResult(null); }}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${mode === 'toWareki' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            西暦 → 和暦
          </button>
          <button
            onClick={() => { setMode('toWestern'); setResult(null); }}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${mode === 'toWestern' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            和暦 → 西暦
          </button>
        </div>

        {mode === 'toWareki' ? (
          <div>
            <label className="block text-sm font-medium mb-1">西暦（年）</label>
            <input type="number" value={westernYear} onChange={(e) => setWesternYear(e.target.value)} placeholder="例: 2025" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">元号</label>
              <select value={eraName} onChange={(e) => setEraName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                {getEraNames().map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">年</label>
              <input type="number" value={eraYear} onChange={(e) => setEraYear(e.target.value)} placeholder="例: 7" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={convert} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">変換結果</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{result.display}</p>
        </div>
      )}
    </div>
  );
}

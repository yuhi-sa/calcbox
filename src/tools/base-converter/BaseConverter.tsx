'use client';

import { useState } from 'react';
import { convertBase, BASE_OPTIONS, ConversionResult } from './base-converter-logic';

export default function BaseConverter() {
  const [value, setValue] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const r = convertBase(value, fromBase);
      setResult(r);
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">値</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            placeholder="変換する値を入力"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">変換元の基数</label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            {BASE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        変換する
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && result.decimal !== '' && (
        <div className="space-y-2 mt-4">
          {([
            ['2進数', result.binary],
            ['8進数', result.octal],
            ['10進数', result.decimal],
            ['16進数', result.hex],
          ] as const).map(([label, val]) => (
            <div key={label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
              <span className="text-sm font-medium">{label}</span>
              <code className="text-sm font-mono">{val}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

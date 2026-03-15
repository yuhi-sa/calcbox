'use client';

import { useState } from 'react';
import { calculate, type CalculationType } from './probability-logic';

export default function ProbabilityCalculator() {
  const [calcType, setCalcType] = useState<CalculationType>('factorial');
  const [n, setN] = useState(5);
  const [r, setR] = useState(2);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    try {
      setError(null);
      const val = calculate(calcType, n, r);
      setResult(val.toString());
    } catch (e) {
      setError(e instanceof Error ? e.message : '計算エラー');
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">計算タイプ</label>
        <select
          value={calcType}
          onChange={(e) => setCalcType(e.target.value as CalculationType)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          <option value="factorial">階乗 (n!)</option>
          <option value="permutation">順列 (nPr)</option>
          <option value="combination">組み合わせ (nCr)</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">n</label>
          <input
            type="number"
            min={0}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        {calcType !== 'factorial' && (
          <div>
            <label className="block text-sm font-medium mb-1">r</label>
            <input
              type="number"
              min={0}
              value={r}
              onChange={(e) => setR(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleCalculate}
        className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
      >
        計算する
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="text-xs text-gray-500 mb-1">結果</div>
          <div className="text-xl font-bold font-mono break-all">{result}</div>
        </div>
      )}
    </div>
  );
}

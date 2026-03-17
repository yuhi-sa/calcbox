'use client';

import { useState } from 'react';
import { calcWarikan, calcWeightedWarikan, RoundingMethod, WarikanResult, WeightedWarikanResult } from './warikan-logic';

export default function WarikanCalculator() {
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState('');
  const [method, setMethod] = useState<RoundingMethod>('floor');
  const [mode, setMode] = useState<'equal' | 'weighted'>('equal');
  const [weights, setWeights] = useState('');
  const [result, setResult] = useState<WarikanResult | null>(null);
  const [weightedResult, setWeightedResult] = useState<WeightedWarikanResult | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    const t = parseFloat(total);
    if (isNaN(t) || t < 0) {
      setError('合計金額は0以上の数値を入力してください。');
      setResult(null);
      setWeightedResult(null);
      return;
    }

    if (mode === 'equal') {
      const p = parseInt(people);
      if (isNaN(p) || p <= 0) {
        setError('人数は1以上の整数を入力してください。');
        setResult(null);
        return;
      }
      setError('');
      setResult(calcWarikan(t, p, method));
      setWeightedResult(null);
    } else {
      const w = weights.split(',').map((s) => parseFloat(s.trim()));
      if (w.some(isNaN) || w.length === 0) {
        setError('重みをカンマ区切りの数値で入力してください。（例: 2,1,1）');
        setWeightedResult(null);
        return;
      }
      if (w.some((v) => v <= 0)) {
        setError('重みは0より大きい数値を入力してください。');
        setWeightedResult(null);
        return;
      }
      setError('');
      setWeightedResult(calcWeightedWarikan(t, w, method));
      setResult(null);
    }
  };

  const reset = () => {
    setTotal('');
    setPeople('');
    setWeights('');
    setResult(null);
    setWeightedResult(null);
    setError('');
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">合計金額（円）</label>
          <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="例: 10000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">分割方法</label>
          <div className="flex gap-3">
            <button onClick={() => setMode('equal')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'equal' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>均等割り</button>
            <button onClick={() => setMode('weighted')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'weighted' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>傾斜配分</button>
          </div>
        </div>

        {mode === 'equal' ? (
          <div>
            <label className="block text-sm font-medium mb-1">人数</label>
            <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} placeholder="例: 3" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">重み（カンマ区切り）</label>
            <input type="text" value={weights} onChange={(e) => setWeights(e.target.value)} placeholder="例: 2,1,1" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">端数処理</label>
          <select value={method} onChange={(e) => setMethod(e.target.value as RoundingMethod)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            <option value="floor">切り捨て</option>
            <option value="ceil">切り上げ</option>
            <option value="round">四捨五入</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">一人あたり</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{result.perPerson.toLocaleString()} 円</p>
          </div>
          {result.remainder !== 0 && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">端数（残り）</p>
              <p className="text-lg font-semibold">{result.remainder} 円</p>
            </div>
          )}
        </div>
      )}

      {weightedResult && (
        <div className="mt-6 space-y-4">
          {weightedResult.amounts.map((amount, i) => (
            <div key={i} className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">人{i + 1}</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{amount.toLocaleString()} 円</p>
            </div>
          ))}
          {weightedResult.remainder !== 0 && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">端数（残り）</p>
              <p className="text-lg font-semibold">{weightedResult.remainder} 円</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Category, categoryLabels, convert, getUnitsForCategory } from './unit-logic';

const categoryKeys: Category[] = ['length', 'weight', 'temperature', 'area'];

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const units = getUnitsForCategory(category);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit('');
    setToUnit('');
    setResult(null);
  };

  const calculate = () => {
    const v = parseFloat(value);
    if (isNaN(v)) {
      alert('数値を入力してください。');
      return;
    }
    if (!fromUnit || !toUnit) {
      alert('単位を選択してください。');
      return;
    }
    setResult(convert(category, fromUnit, toUnit, v));
  };

  const reset = () => {
    setValue('');
    setFromUnit('');
    setToUnit('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">カテゴリ</label>
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map((cat) => (
              <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium ${category === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">値</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="例: 100" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">変換元</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              <option value="">選択してください</option>
              {units.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">変換先</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              <option value="">選択してください</option>
              {units.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result !== null && (
        <div className="mt-6">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">変換結果</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {result < 0.0001 || result > 1_000_000_000 ? result.toExponential(4) : parseFloat(result.toPrecision(10)).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  convertCookingUnit,
  CookingConvertResult,
  CookingUnit,
  INGREDIENTS,
  UNIT_LABELS,
} from './cooking-logic';

const cookingUnits: CookingUnit[] = ['tablespoon', 'teaspoon', 'cup', 'ml', 'cc', 'g'];

export default function CookingConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<CookingUnit>('tablespoon');
  const [toUnit, setToUnit] = useState<CookingUnit>('g');
  const [ingredientIndex, setIngredientIndex] = useState(0);
  const [result, setResult] = useState<CookingConvertResult | null>(null);

  const calculate = () => {
    const v = parseFloat(value);
    if (!v || v <= 0 || v > 100000) {
      alert('値を正しく入力してください。');
      return;
    }
    setResult(convertCookingUnit({ value: v, fromUnit, toUnit, ingredientIndex }));
  };

  const reset = () => {
    setValue('');
    setFromUnit('tablespoon');
    setToUnit('g');
    setIngredientIndex(0);
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">食材</label>
          <select value={ingredientIndex} onChange={(e) => setIngredientIndex(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {INGREDIENTS.map((ing, i) => (
              <option key={i} value={i}>{ing.nameJa}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">変換元</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as CookingUnit)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              {cookingUnits.map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">変換先</label>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value as CookingUnit)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              {cookingUnits.map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u]}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">量</label>
          <input type="number" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="例: 2" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{result.ingredient}</p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {result.inputValue} {UNIT_LABELS[result.inputUnit]}
            </p>
            <p className="text-2xl font-bold text-orange-500 mt-1">= {result.outputValue} {UNIT_LABELS[result.outputUnit]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

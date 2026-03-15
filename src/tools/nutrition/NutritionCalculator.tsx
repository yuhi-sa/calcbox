'use client';

import { useState } from 'react';
import { calculateNutrition, NutritionResult, FOOD_DATABASE, SelectedFood } from './nutrition-logic';

export default function NutritionCalculator() {
  const [selections, setSelections] = useState<{ foodIndex: number; quantity: string }[]>([
    { foodIndex: 0, quantity: '100' },
  ]);
  const [result, setResult] = useState<NutritionResult | null>(null);

  const addItem = () => {
    setSelections([...selections, { foodIndex: 0, quantity: '100' }]);
  };

  const removeItem = (index: number) => {
    setSelections(selections.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'foodIndex' | 'quantity', value: string) => {
    const updated = [...selections];
    if (field === 'foodIndex') {
      updated[index] = { ...updated[index], foodIndex: parseInt(value) };
    } else {
      updated[index] = { ...updated[index], quantity: value };
    }
    setSelections(updated);
  };

  const calculate = () => {
    const selected: SelectedFood[] = [];
    for (const s of selections) {
      const q = parseFloat(s.quantity);
      if (!q || q <= 0) {
        alert('すべての食材の量を正しく入力してください。');
        return;
      }
      selected.push({ foodIndex: s.foodIndex, quantityGrams: q });
    }
    setResult(calculateNutrition(selected));
  };

  const reset = () => {
    setSelections([{ foodIndex: 0, quantity: '100' }]);
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        {selections.map((s, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">食材 {i + 1}</label>
              <select value={s.foodIndex} onChange={(e) => updateItem(i, 'foodIndex', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                {FOOD_DATABASE.map((f, fi) => (
                  <option key={fi} value={fi}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="w-28">
              <label className="block text-sm font-medium mb-1">量（g）</label>
              <input type="number" value={s.quantity} onChange={(e) => updateItem(i, 'quantity', e.target.value)} placeholder="100" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            {selections.length > 1 && (
              <button onClick={() => removeItem(i)} className="px-3 py-2 text-red-500 hover:text-red-700 text-sm">削除</button>
            )}
          </div>
        ))}
        <button onClick={addItem} className="text-sm text-blue-500 hover:text-blue-700">+ 食材を追加</button>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">カロリー</p>
              <p className="text-2xl font-bold text-orange-500">{result.totalCalories.toFixed(0)} kcal</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">たんぱく質</p>
              <p className="text-2xl font-bold text-blue-500">{result.totalProtein.toFixed(1)} g</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">脂質</p>
              <p className="text-2xl font-bold text-yellow-500">{result.totalFat.toFixed(1)} g</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">炭水化物</p>
              <p className="text-2xl font-bold text-green-500">{result.totalCarbs.toFixed(1)} g</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left py-2">食材</th>
                  <th className="text-right py-2">量</th>
                  <th className="text-right py-2">カロリー</th>
                  <th className="text-right py-2">たんぱく質</th>
                  <th className="text-right py-2">脂質</th>
                  <th className="text-right py-2">炭水化物</th>
                </tr>
              </thead>
              <tbody>
                {result.entries.map((e, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">{e.name}</td>
                    <td className="text-right py-2">{e.quantityGrams}g</td>
                    <td className="text-right py-2">{e.calories.toFixed(0)}</td>
                    <td className="text-right py-2">{e.protein.toFixed(1)}</td>
                    <td className="text-right py-2">{e.fat.toFixed(1)}</td>
                    <td className="text-right py-2">{e.carbs.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

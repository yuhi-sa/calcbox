'use client';

import { useState } from 'react';
import { calculatePetAge, PetAgeResult, PetType, PET_TYPE_LABELS } from './pet-age-logic';

export default function PetAgeCalculator() {
  const [petType, setPetType] = useState<PetType>('cat');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<PetAgeResult | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    if (!a || a < 0 || a > 30) {
      alert('年齢（0〜30歳）を正しく入力してください。');
      return;
    }
    setResult(calculatePetAge(petType, a));
  };

  const reset = () => {
    setPetType('cat');
    setAge('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">ペットの種類</label>
          <select value={petType} onChange={(e) => setPetType(e.target.value as PetType)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {(Object.entries(PET_TYPE_LABELS) as [PetType, string][]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ペットの年齢（歳）</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 3" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">人間に換算した年齢</p>
            <p className="text-4xl font-bold text-orange-500">{Math.round(result.humanAge)} 歳</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">ペットの種類</p>
              <p className="text-lg font-semibold">{PET_TYPE_LABELS[result.petType]}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">ペットの年齢</p>
              <p className="text-lg font-semibold">{result.petAge} 歳</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

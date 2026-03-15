'use client';

import { useState } from 'react';
import { calculateMovingCost, MovingCostBreakdown, HouseholdSize, Season } from './moving-cost-logic';

const householdOptions: HouseholdSize[] = ['1人', '2人', '3人', '4人+'];
const seasonOptions: Season[] = ['通常期', '繁忙期'];

export default function MovingCostEstimator() {
  const [distance, setDistance] = useState('');
  const [household, setHousehold] = useState<HouseholdSize>('1人');
  const [season, setSeason] = useState<Season>('通常期');
  const [result, setResult] = useState<MovingCostBreakdown | null>(null);

  const calculate = () => {
    const dist = parseFloat(distance);
    if (!dist || dist <= 0) {
      alert('距離を正しく入力してください。');
      return;
    }
    setResult(calculateMovingCost(dist, household, season));
  };

  const reset = () => {
    setDistance('');
    setHousehold('1人');
    setSeason('通常期');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">引越し距離（km）</label>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="例: 50" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">世帯人数</label>
          <select value={household} onChange={(e) => setHousehold(e.target.value as HouseholdSize)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {householdOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">時期</label>
          <select value={season} onChange={(e) => setSeason(e.target.value as Season)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {seasonOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">引越し費用（概算）</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">&yen;{result.totalCost.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">内訳</h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">基本料金</span>
                <span className="font-medium">&yen;{result.baseCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">距離加算（20km超分）</span>
                <span className="font-medium">&yen;{result.distanceSurcharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">時期倍率</span>
                <span className="font-medium">&times;{result.seasonMultiplier}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

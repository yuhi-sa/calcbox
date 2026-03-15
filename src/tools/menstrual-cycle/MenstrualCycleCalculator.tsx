'use client';

import { useState } from 'react';
import { calculateCycles, formatDate, MenstrualCycleResult } from './menstrual-cycle-logic';

export default function MenstrualCycleCalculator() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [result, setResult] = useState<MenstrualCycleResult | null>(null);

  const calculate = () => {
    if (!lastPeriod) {
      alert('最終月経開始日を入力してください。');
      return;
    }
    const len = parseInt(cycleLength);
    if (!len || len < 20 || len > 45) {
      alert('周期は20〜45日の範囲で入力してください。');
      return;
    }
    const date = new Date(lastPeriod);
    setResult(calculateCycles(date, len));
  };

  const reset = () => {
    setLastPeriod('');
    setCycleLength('28');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">最終月経開始日</label>
          <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">平均周期（日）</label>
          <input type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="28" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">周期: {result.cycleLength}日</p>
          {result.nextCycles.map((cycle, i) => (
            <div key={i} className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">第{i + 1}周期</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">次の生理予定日</p>
                  <p className="font-semibold text-orange-500">{formatDate(cycle.periodStart)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">排卵予定日</p>
                  <p className="font-semibold text-orange-500">{formatDate(cycle.ovulationDate)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 dark:text-gray-400">妊娠しやすい期間</p>
                  <p className="font-semibold text-orange-500">{formatDate(cycle.fertileWindowStart)} 〜 {formatDate(cycle.fertileWindowEnd)}</p>
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 dark:text-gray-500">※ この計算は目安です。医療的な判断には医師にご相談ください。</p>
        </div>
      )}
    </div>
  );
}

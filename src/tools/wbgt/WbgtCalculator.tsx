'use client';

import { useState } from 'react';
import { calculateWbgt, WbgtResult } from './wbgt-logic';

export default function WbgtCalculator() {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [result, setResult] = useState<WbgtResult | null>(null);

  const dangerColor = (level: string) => {
    switch (level) {
      case '危険': return 'text-red-600 dark:text-red-400';
      case '厳重警戒': return 'text-orange-600 dark:text-orange-400';
      case '警戒': return 'text-yellow-600 dark:text-yellow-400';
      case '注意': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };

  const calculate = () => {
    const t = parseFloat(temperature);
    const h = parseFloat(humidity);
    if (isNaN(t) || isNaN(h) || t < -20 || t > 50 || h < 0 || h > 100) {
      alert('気温（-20〜50°C）と湿度（0〜100%）を正しく入力してください。');
      return;
    }
    setResult(calculateWbgt({ temperature: t, humidity: h }));
  };

  const reset = () => {
    setTemperature('');
    setHumidity('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">気温（°C）</label>
            <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="例: 33" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">湿度（%）</label>
            <input type="number" value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder="例: 70" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">暑さ指数（WBGT）</p>
            <p className="text-4xl font-bold text-orange-500">{result.wbgt} °C</p>
            <p className={`text-xl font-bold mt-2 ${dangerColor(result.dangerLevel)}`}>{result.dangerLevel}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">推奨事項</p>
            <p className="text-sm font-medium">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

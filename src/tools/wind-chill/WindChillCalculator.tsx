'use client';

import { useState } from 'react';
import { calculateWindChill, WindChillResult, WindSpeedUnit } from './wind-chill-logic';

export default function WindChillCalculator() {
  const [temperature, setTemperature] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [windSpeedUnit, setWindSpeedUnit] = useState<WindSpeedUnit>('m/s');
  const [result, setResult] = useState<WindChillResult | null>(null);

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
    const ws = parseFloat(windSpeed);
    if (isNaN(t) || isNaN(ws) || t < -50 || t > 50 || ws < 0 || ws > 200) {
      alert('気温（-50〜50°C）と風速（0〜200）を正しく入力してください。');
      return;
    }
    setResult(calculateWindChill({ temperature: t, windSpeed: ws, windSpeedUnit }));
  };

  const reset = () => {
    setTemperature('');
    setWindSpeed('');
    setWindSpeedUnit('m/s');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">気温（°C）</label>
          <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="例: -5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">風速</label>
            <input type="number" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} placeholder="例: 10" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">単位</label>
            <select value={windSpeedUnit} onChange={(e) => setWindSpeedUnit(e.target.value as WindSpeedUnit)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              <option value="m/s">m/s</option>
              <option value="km/h">km/h</option>
            </select>
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
            <p className="text-sm text-gray-600 dark:text-gray-400">体感温度</p>
            <p className="text-4xl font-bold text-orange-500">{result.windChill} °C</p>
            <p className={`text-xl font-bold mt-2 ${dangerColor(result.dangerLevel)}`}>{result.dangerLevel}</p>
          </div>
          {!result.isValid && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">{result.validationMessage}</p>
            </div>
          )}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">凍傷リスク</p>
            <p className="text-sm font-medium">{result.frostbiteRisk}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">風速</p>
            <p className="text-lg font-semibold">{result.windSpeedKmh.toFixed(1)} km/h</p>
          </div>
        </div>
      )}
    </div>
  );
}

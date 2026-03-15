'use client';

import { useState } from 'react';
import { CalcMode, calculate, SpeedResult, formatTime } from './speed-logic';

const modeLabels: Record<CalcMode, string> = {
  speed: '速度を求める',
  distance: '距離を求める',
  time: '時間を求める',
};

export default function SpeedCalculator() {
  const [mode, setMode] = useState<CalcMode>('speed');
  const [speed, setSpeed] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<SpeedResult | null>(null);

  const calc = () => {
    try {
      const values = {
        speed: speed ? parseFloat(speed) : undefined,
        distance: distance ? parseFloat(distance) : undefined,
        time: time ? parseFloat(time) : undefined,
      };
      setResult(calculate(mode, values));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const reset = () => {
    setSpeed('');
    setDistance('');
    setTime('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">計算モード</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(modeLabels) as CalcMode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); reset(); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === m ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {modeLabels[m]}
              </button>
            ))}
          </div>
        </div>

        {mode !== 'speed' && (
          <div>
            <label className="block text-sm font-medium mb-1">速度（km/h）</label>
            <input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="例: 60" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}

        {mode !== 'distance' && (
          <div>
            <label className="block text-sm font-medium mb-1">距離（km）</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="例: 100" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}

        {mode !== 'time' && (
          <div>
            <label className="block text-sm font-medium mb-1">時間（時間）</label>
            <input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="例: 2" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={calc} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">速度</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{result.speed.toFixed(2)} km/h</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">距離</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{result.distance.toFixed(2)} km</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">時間</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatTime(result.time)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">ペース</p>
              <p className="text-lg font-semibold">{result.pace.toFixed(2)} 分/km</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">マラソン予測タイム</p>
              <p className="text-lg font-semibold">{result.marathonTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

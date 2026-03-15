'use client';

import { useState } from 'react';
import { calculatePaint, PaintCalcResult } from './paint-calc-logic';

export default function PaintCalculator() {
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [height, setHeight] = useState('');
  const [doors, setDoors] = useState('');
  const [windows, setWindows] = useState('');
  const [result, setResult] = useState<PaintCalcResult | null>(null);

  const calculate = () => {
    const w = parseFloat(width);
    const d = parseFloat(depth);
    const h = parseFloat(height);
    const dr = parseInt(doors) || 0;
    const wn = parseInt(windows) || 0;
    if (!w || !d || !h || w <= 0 || d <= 0 || h <= 0) {
      alert('部屋の寸法を正しく入力してください。');
      return;
    }
    setResult(calculatePaint({ width: w, depth: d, height: h, doors: dr, windows: wn }));
  };

  const reset = () => {
    setWidth('');
    setDepth('');
    setHeight('');
    setDoors('');
    setWindows('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">幅（m）</label>
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="例: 5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">奥行（m）</label>
            <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="例: 4" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">高さ（m）</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 2.5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">ドア数</label>
            <input type="number" value={doors} onChange={(e) => setDoors(e.target.value)} placeholder="例: 1" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">窓数</label>
            <input type="number" value={windows} onChange={(e) => setWindows(e.target.value)} placeholder="例: 2" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ペンキ必要量</p>
                <p className="text-3xl font-bold text-orange-500">{result.paintLiters} L</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">壁紙ロール数</p>
                <p className="text-3xl font-bold text-orange-500">{result.wallpaperRolls} 本</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">総壁面積</p>
              <p className="text-lg font-semibold">{result.totalWallArea} m²</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">正味塗装面積</p>
              <p className="text-lg font-semibold">{result.netWallArea} m²</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

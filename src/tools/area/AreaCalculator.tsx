'use client';

import { useState } from 'react';
import { Shape, calcArea, AreaResult } from './area-logic';

const shapeLabels: Record<Shape, string> = {
  rectangle: '長方形',
  triangle: '三角形',
  circle: '円',
  trapezoid: '台形',
};

export default function AreaCalculator() {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [base, setBase] = useState('');
  const [radius, setRadius] = useState('');
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');
  const [result, setResult] = useState<AreaResult | null>(null);

  const calculate = () => {
    try {
      const dims = {
        width: width ? parseFloat(width) : undefined,
        height: height ? parseFloat(height) : undefined,
        base: base ? parseFloat(base) : undefined,
        radius: radius ? parseFloat(radius) : undefined,
        top: top ? parseFloat(top) : undefined,
        bottom: bottom ? parseFloat(bottom) : undefined,
      };
      setResult(calcArea(shape, dims));
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const reset = () => {
    setWidth(''); setHeight(''); setBase(''); setRadius(''); setTop(''); setBottom('');
    setResult(null);
  };

  const handleShapeChange = (s: Shape) => {
    setShape(s);
    reset();
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">形状</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(shapeLabels) as Shape[]).map((s) => (
              <button key={s} onClick={() => handleShapeChange(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${shape === s ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {shapeLabels[s]}
              </button>
            ))}
          </div>
        </div>

        {shape === 'rectangle' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">幅（m）</label>
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="例: 10" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">高さ（m）</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </>
        )}

        {shape === 'triangle' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">底辺（m）</label>
              <input type="number" value={base} onChange={(e) => setBase(e.target.value)} placeholder="例: 10" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">高さ（m）</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </>
        )}

        {shape === 'circle' && (
          <div>
            <label className="block text-sm font-medium mb-1">半径（m）</label>
            <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="例: 5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}

        {shape === 'trapezoid' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">上辺（m）</label>
              <input type="number" value={top} onChange={(e) => setTop(e.target.value)} placeholder="例: 3" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">下辺（m）</label>
              <input type="number" value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder="例: 5" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">高さ（m）</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 4" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">面積</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">{result.m2.toFixed(2)} m²</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">坪</p>
              <p className="text-lg font-semibold">{result.tsubo.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">畳</p>
              <p className="text-lg font-semibold">{result.jou.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">ヘクタール</p>
              <p className="text-lg font-semibold">{result.ha.toFixed(4)}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">エーカー</p>
              <p className="text-lg font-semibold">{result.acre.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

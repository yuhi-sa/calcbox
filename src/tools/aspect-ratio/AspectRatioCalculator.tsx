'use client';

import { useState } from 'react';
import { calculateAspectRatio, calculateDimension, AspectRatioResult, DimensionResult, PRESETS } from './aspect-ratio-logic';

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<AspectRatioResult | null>(null);

  const [presetIndex, setPresetIndex] = useState(0);
  const [knownValue, setKnownValue] = useState('');
  const [knownSide, setKnownSide] = useState<'width' | 'height'>('width');
  const [dimResult, setDimResult] = useState<DimensionResult | null>(null);

  const calcRatio = () => {
    const w = parseInt(width);
    const h = parseInt(height);
    if (!w || !h || w <= 0 || h <= 0) {
      alert('幅と高さを正しく入力してください。');
      return;
    }
    setResult(calculateAspectRatio(w, h));
  };

  const calcDimension = () => {
    const val = parseInt(knownValue);
    if (!val || val <= 0) {
      alert('値を正しく入力してください。');
      return;
    }
    const preset = PRESETS[presetIndex];
    setDimResult(calculateDimension(preset.width, preset.height, val, knownSide));
  };

  const reset = () => {
    setWidth('');
    setHeight('');
    setResult(null);
    setKnownValue('');
    setDimResult(null);
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Ratio calculation */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">アスペクト比を求める</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">幅（px）</label>
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="例: 1920" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">高さ（px）</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 1080" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={calcRatio} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
            <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
          </div>
        </div>

        {result && (
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">アスペクト比</p>
            <p className="text-4xl font-bold text-orange-500">{result.ratio}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">小数比: {result.decimalRatio.toFixed(4)}</p>
          </div>
        )}

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Dimension calculation */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">比率から寸法を計算</h3>
          <div>
            <label className="block text-sm font-medium mb-1">プリセット比率</label>
            <select value={presetIndex} onChange={(e) => setPresetIndex(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              {PRESETS.map((p, i) => (
                <option key={i} value={i}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">既知の辺</label>
              <select value={knownSide} onChange={(e) => setKnownSide(e.target.value as 'width' | 'height')} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                <option value="width">幅</option>
                <option value="height">高さ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">値（px）</label>
              <input type="number" value={knownValue} onChange={(e) => setKnownValue(e.target.value)} placeholder="例: 1920" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
            </div>
          </div>
          <button onClick={calcDimension} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
        </div>

        {dimResult && (
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">幅</p>
                <p className="text-2xl font-bold text-orange-500">{dimResult.width} px</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">高さ</p>
                <p className="text-2xl font-bold text-orange-500">{dimResult.height} px</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

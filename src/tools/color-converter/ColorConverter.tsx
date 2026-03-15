'use client';

import { useState } from 'react';
import { parseColor, ColorResult } from './color-converter-logic';

export default function ColorConverter() {
  const [input, setInput] = useState('#FF5733');
  const [result, setResult] = useState<ColorResult | null>(null);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      setResult(parseColor(input));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">色の値</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#RRGGBB / rgb(r,g,b) / hsl(h,s,l)"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <button onClick={convert} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        変換する
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="space-y-3 mt-4">
          <div className="w-full h-20 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: result.hex }} />
          {([
            ['HEX', result.hex],
            ['RGB', `rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`],
            ['HSL', `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`],
          ] as const).map(([label, val]) => (
            <div key={label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
              <span className="text-sm font-medium">{label}</span>
              <code className="text-sm font-mono">{val}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

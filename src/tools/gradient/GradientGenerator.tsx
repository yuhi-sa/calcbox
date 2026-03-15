'use client';

import { useState } from 'react';
import { generateGradientCss, GradientType, GradientStop, DIRECTION_PRESETS, RADIAL_SHAPES } from './gradient-logic';

export default function GradientGenerator() {
  const [type, setType] = useState<GradientType>('linear');
  const [direction, setDirection] = useState('to right');
  const [shape, setShape] = useState('circle');
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#ff0000', position: 0 },
    { color: '#0000ff', position: 100 },
  ]);

  const css = generateGradientCss(type, stops, direction, shape);

  const updateStop = (index: number, field: keyof GradientStop, value: string | number) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  const addStop = () => {
    setStops([...stops, { color: '#00ff00', position: 50 }]);
  };

  const removeStop = (index: number) => {
    if (stops.length > 2) setStops(stops.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">グラデーション種類</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GradientType)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="linear">線形</option>
            <option value="radial">放射状</option>
          </select>
        </div>
        <div>
          {type === 'linear' ? (
            <>
              <label className="block text-sm font-medium mb-1">方向</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                {DIRECTION_PRESETS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium mb-1">形状</label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              >
                {RADIAL_SHAPES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">カラーストップ</label>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(i, 'color', e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={stop.position}
              onChange={(e) => updateStop(i, 'position', Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <span className="text-sm text-gray-500">%</span>
            {stops.length > 2 && (
              <button onClick={() => removeStop(i)} className="text-red-500 text-sm hover:opacity-70">削除</button>
            )}
          </div>
        ))}
        <button onClick={addStop} className="text-sm text-[var(--color-primary)] hover:opacity-70">+ ストップを追加</button>
      </div>

      <div className="w-full h-24 rounded-lg border border-gray-300 dark:border-gray-600" style={{ background: css }} />

      <div>
        <label className="block text-sm font-medium mb-1">CSS</label>
        <code className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm font-mono break-all">
          background: {css};
        </code>
      </div>
    </div>
  );
}

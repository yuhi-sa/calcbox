'use client';

import { useState } from 'react';
import { convertShoeSize, ShoeSizeResult, SizeSystem, Gender, SIZE_SYSTEM_LABELS } from './shoe-size-logic';

const sizeSystems: SizeSystem[] = ['jp', 'us', 'uk', 'eu'];

export default function ShoeSizeConverter() {
  const [value, setValue] = useState('');
  const [fromSystem, setFromSystem] = useState<SizeSystem>('jp');
  const [gender, setGender] = useState<Gender>('men');
  const [result, setResult] = useState<ShoeSizeResult | null>(null);

  const calculate = () => {
    const v = parseFloat(value);
    if (!v || v < 1 || v > 60) {
      alert('サイズを正しく入力してください。');
      return;
    }
    setResult(convertShoeSize({ value: v, fromSystem, gender }));
  };

  const reset = () => {
    setValue('');
    setFromSystem('jp');
    setGender('men');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">性別</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="gender" checked={gender === 'men'} onChange={() => setGender('men')} />
              男性
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="gender" checked={gender === 'women'} onChange={() => setGender('women')} />
              女性
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">変換元のサイズ規格</label>
          <select value={fromSystem} onChange={(e) => setFromSystem(e.target.value as SizeSystem)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            {sizeSystems.map((s) => (
              <option key={s} value={s}>{SIZE_SYSTEM_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">サイズ</label>
          <input type="number" step="0.5" value={value} onChange={(e) => setValue(e.target.value)} placeholder="例: 26" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{gender === 'men' ? '男性' : '女性'}サイズ変換結果</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(Object.entries({ jp: result.jp, us: result.us, uk: result.uk, eu: result.eu }) as [SizeSystem, number][]).map(([system, size]) => (
              <div key={system} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">{SIZE_SYSTEM_LABELS[system]}</p>
                <p className="text-2xl font-bold">{size}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

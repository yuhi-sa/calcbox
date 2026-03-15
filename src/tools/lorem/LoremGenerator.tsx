'use client';

import { useState } from 'react';
import { generateLorem, type LoremUnit } from './lorem-logic';
import { copyToClipboard } from '@/lib/clipboard';
import { showToast } from '@/components/Toast';

export default function LoremGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [result, setResult] = useState('');

  const handleGenerate = () => {
    if (count < 1 || count > 100) {
      alert('数量は1〜100の範囲で入力してください。');
      return;
    }
    setResult(generateLorem(count, unit));
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(result);
    showToast(ok ? 'コピーしました' : 'コピーに失敗しました', ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">数量</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">単位</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as LoremUnit)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="paragraphs">段落</option>
            <option value="sentences">文</option>
            <option value="words">単語</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
      >
        生成する
      </button>

      {result && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs font-medium hover:opacity-90"
            >
              コピー
            </button>
          </div>
          <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

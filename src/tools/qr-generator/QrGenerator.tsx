'use client';

import { useState } from 'react';
import { generateQrCode } from './qr-generator-logic';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(200);
  const [result, setResult] = useState<{ url: string; isValid: boolean; error?: string } | null>(null);

  const handleGenerate = () => {
    setResult(generateQrCode({ text, size }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">テキスト / URL</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">サイズ (px)</label>
        <input
          type="number"
          min={100}
          max={1000}
          step={50}
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value) || 200)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
      >
        生成する
      </button>

      {result && !result.isValid && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
          {result.error}
        </div>
      )}

      {result && result.isValid && (
        <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <img
            src={result.url}
            alt="QRコード"
            width={size}
            height={size}
            className="rounded"
          />
          <p className="text-xs text-gray-500 break-all text-center max-w-full">{text}</p>
        </div>
      )}
    </div>
  );
}

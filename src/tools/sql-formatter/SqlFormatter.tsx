'use client';

import { useState } from 'react';
import { formatSQL } from './sql-formatter-logic';
import { copyToClipboard } from '@/infrastructure/clipboard';
import { showToast } from '@/components/Toast';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleFormat = () => {
    setOutput(formatSQL(input));
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(output);
    showToast(ok ? 'コピーしました' : 'コピーに失敗しました', ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">SQL クエリ</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder="SELECT * FROM users WHERE id = 1"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
        />
      </div>

      <button
        onClick={handleFormat}
        className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
      >
        フォーマットする
      </button>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">フォーマット結果</label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs font-medium hover:opacity-90"
            >
              コピー
            </button>
          </div>
          <pre className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm font-mono overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

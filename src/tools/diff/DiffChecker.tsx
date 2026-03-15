'use client';

import { useState } from 'react';
import { computeDiff, getDiffStats } from './diff-logic';

export default function DiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const diff = showDiff ? computeDiff(text1, text2) : [];
  const stats = showDiff ? getDiffStats(diff) : null;

  const statusColors: Record<string, string> = {
    same: '',
    added: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    removed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  };

  const statusPrefixes: Record<string, string> = {
    same: '  ',
    added: '+ ',
    removed: '- ',
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">テキスト1（元）</label>
          <textarea
            value={text1}
            onChange={(e) => { setText1(e.target.value); setShowDiff(false); }}
            rows={8}
            placeholder="元のテキスト..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">テキスト2（変更後）</label>
          <textarea
            value={text2}
            onChange={(e) => { setText2(e.target.value); setShowDiff(false); }}
            rows={8}
            placeholder="変更後のテキスト..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          />
        </div>
      </div>

      <button
        onClick={() => setShowDiff(true)}
        className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90"
      >
        比較する
      </button>

      {showDiff && stats && (
        <div className="space-y-3">
          <div className="flex gap-4 text-sm">
            <span>同一: {stats.same}行</span>
            <span className="text-green-600">追加: {stats.added}行</span>
            <span className="text-red-600">削除: {stats.removed}行</span>
          </div>
          <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {diff.map((line, i) => (
              <div key={i} className={`px-3 py-0.5 text-sm font-mono ${statusColors[line.status]}`}>
                {statusPrefixes[line.status]}{line.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

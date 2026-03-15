'use client';

import { useState } from 'react';
import { testRegex, RegexResult } from './regex-logic';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [result, setResult] = useState<RegexResult | null>(null);

  const test = () => {
    setResult(testRegex(pattern, flags, text));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">正規表現パターン</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
            placeholder="\\d+"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">フラグ</label>
          <div className="flex gap-2">
            {['g', 'i', 'm'].map((f) => (
              <label key={f} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={flags.includes(f)}
                  onChange={() => setFlags(flags.includes(f) ? flags.replace(f, '') : flags + f)}
                />
                {f}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">テスト文字列</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          placeholder="テストする文字列を入力"
        />
      </div>

      <button onClick={test} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        テストする
      </button>

      {result && !result.valid && (
        <p className="text-red-500 text-sm">無効なパターン: {result.error}</p>
      )}

      {result && result.valid && (
        <div className="space-y-2 mt-4">
          <p className="text-sm font-medium">マッチ数: {result.count}</p>
          {result.matches.map((m, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">マッチ {i + 1}</span>
                <span className="text-gray-500">位置: {m.index}</span>
              </div>
              <code className="text-sm font-mono block mt-1">{m.match}</code>
              {m.groups.length > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  グループ: {m.groups.map((g, j) => <span key={j} className="mr-2">({j + 1}) {g}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

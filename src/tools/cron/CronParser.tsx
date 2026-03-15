'use client';

import { useState } from 'react';
import { parseCron, CronParseResult, CRON_PRESETS } from './cron-logic';

export default function CronParser() {
  const [expression, setExpression] = useState('* * * * *');
  const [result, setResult] = useState<CronParseResult | null>(null);

  const parse = () => {
    setResult(parseCron(expression));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cron式</label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          placeholder="* * * * *"
        />
        <p className="text-xs text-gray-500 mt-1">分 時 日 月 曜日</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">プリセット</label>
        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setExpression(preset.value)}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs hover:opacity-80"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={parse} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        解析する
      </button>

      {result && !result.valid && (
        <p className="text-red-500 text-sm">{result.error}</p>
      )}

      {result && result.valid && (
        <div className="space-y-4 mt-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <span className="text-sm font-medium">説明: </span>
            <span className="text-sm">{result.description}</span>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">次の実行予定</h3>
            <div className="space-y-1">
              {result.nextExecutions.map((time, i) => (
                <div key={i} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm font-mono">
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

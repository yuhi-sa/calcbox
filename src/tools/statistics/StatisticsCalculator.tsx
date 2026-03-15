'use client';

import { useState } from 'react';
import { parseNumbers, calculateStatistics } from './statistics-logic';

export default function StatisticsCalculator() {
  const [input, setInput] = useState('');

  const numbers = parseNumbers(input);
  const result = calculateStatistics(numbers);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">数値（カンマまたは改行区切り）</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder="例: 10, 20, 30, 40, 50"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'データ数', value: result.count },
            { label: '合計', value: result.sum },
            { label: '平均', value: result.mean.toFixed(4) },
            { label: '中央値', value: result.median.toFixed(4) },
            { label: '最頻値', value: result.mode.length > 0 ? result.mode.join(', ') : 'なし' },
            { label: '最小値', value: result.min },
            { label: '最大値', value: result.max },
            { label: '範囲', value: result.range },
            { label: '分散', value: result.variance.toFixed(4) },
            { label: '標準偏差', value: result.standardDeviation.toFixed(4) },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className="text-lg font-bold">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

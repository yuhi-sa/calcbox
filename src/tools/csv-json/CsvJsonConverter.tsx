'use client';

import { useState } from 'react';
import { convertCsvJson, ConvertDirection, Delimiter } from './csv-json-logic';

export default function CsvJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<ConvertDirection>('csv-to-json');
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      setOutput(convertCsvJson(input, direction, delimiter));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">変換方向</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as ConvertDirection)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="csv-to-json">CSV → JSON</option>
            <option value="json-to-csv">JSON → CSV</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">区切り文字</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as Delimiter)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value=",">カンマ (,)</option>
            <option value="	">タブ</option>
            <option value=";">セミコロン (;)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">入力</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          placeholder={direction === 'csv-to-json' ? 'name,age\nAlice,30' : '[{"name":"Alice","age":30}]'}
        />
      </div>

      <button onClick={convert} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        変換する
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {output && (
        <div>
          <label className="block text-sm font-medium mb-1">結果</label>
          <textarea
            value={output}
            readOnly
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          />
        </div>
      )}
    </div>
  );
}

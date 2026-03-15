'use client';

import { useState } from 'react';
import { formatJson, minifyJson, validateJson } from './json-formatter-logic';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [valid, setValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const handleFormat = () => {
    const result = formatJson(input, indent);
    setOutput(result.formatted);
    setValid(result.valid);
    setError(result.error || '');
  };

  const handleMinify = () => {
    const result = minifyJson(input);
    setOutput(result.formatted);
    setValid(result.valid);
    setError(result.error || '');
  };

  const handleValidate = () => {
    const result = validateJson(input);
    setValid(result.valid);
    setError(result.error || '');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">JSON入力</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          placeholder='{"key": "value"}'
        />
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">インデント</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value={2}>2スペース</option>
            <option value={4}>4スペース</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleFormat} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">整形する</button>
        <button onClick={handleMinify} className="px-6 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:opacity-90">圧縮する</button>
        <button onClick={handleValidate} className="px-6 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:opacity-90">検証する</button>
      </div>

      {valid !== null && (
        <p className={`text-sm font-medium ${valid ? 'text-green-600' : 'text-red-500'}`}>
          {valid ? '有効なJSONです' : `無効なJSON: ${error}`}
        </p>
      )}

      {output && (
        <div>
          <label className="block text-sm font-medium mb-1">結果</label>
          <textarea
            value={output}
            readOnly
            rows={8}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          />
        </div>
      )}
    </div>
  );
}

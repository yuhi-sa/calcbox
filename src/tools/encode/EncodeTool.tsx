'use client';

import { useState } from 'react';
import { processEncode, EncodingType, Direction } from './encode-logic';

export default function EncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState<EncodingType>('base64');
  const [direction, setDirection] = useState<Direction>('encode');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      setOutput(processEncode(input, type, direction));
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">エンコード種類</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EncodingType)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="base64">Base64</option>
            <option value="url">URL</option>
            <option value="html">HTMLエンティティ</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">方向</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as Direction)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="encode">エンコード</option>
            <option value="decode">デコード</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">入力</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          placeholder="テキストを入力"
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
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          />
        </div>
      )}
    </div>
  );
}

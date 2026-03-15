'use client';

import { useState, useEffect } from 'react';
import { generateUUIDv4, validateUUID } from './uuid-logic';
import { copyToClipboard } from '@/lib/clipboard';
import { showToast } from '@/components/Toast';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [validateInput, setValidateInput] = useState('');
  const [validationResult, setValidationResult] = useState<string>('');
  const [validationColor, setValidationColor] = useState('');

  const generate = () => {
    const c = Math.max(1, Math.min(100, count));
    const result: string[] = [];
    for (let i = 0; i < c; i++) result.push(generateUUIDv4());
    setUuids(result);
  };

  useEffect(() => { generate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = async (text: string) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? 'コピーしました' : 'コピーに失敗しました', ok ? 'success' : 'error');
  };

  const handleValidate = (val: string) => {
    setValidateInput(val);
    if (!val.trim()) { setValidationResult(''); return; }
    const result = validateUUID(val.trim());
    if (result.valid) {
      setValidationResult(`有効なUUID（v${result.version}）です`);
      setValidationColor('#22c55e');
    } else {
      setValidationResult('無効なUUID形式です');
      setValidationColor('#ef4444');
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator */}
      <div>
        <div className="flex gap-2 items-end mb-3">
          <div>
            <label className="block text-sm font-medium mb-1">生成数</label>
            <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
          <button onClick={generate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">生成</button>
          {uuids.length > 1 && (
            <button onClick={() => copy(uuids.join('\n'))} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">すべてコピー</button>
          )}
        </div>

        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
              <code className="flex-1 text-sm font-mono break-all">{uuid}</code>
              <button onClick={() => copy(uuid)} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs font-medium hover:opacity-90 shrink-0">コピー</button>
            </div>
          ))}
        </div>
      </div>

      {/* Validator */}
      <div>
        <h2 className="text-lg font-semibold mb-2">UUIDバリデーション</h2>
        <input
          type="text"
          value={validateInput}
          onChange={(e) => handleValidate(e.target.value)}
          placeholder="UUIDを入力して検証..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
        />
        {validationResult && (
          <p className="mt-2 text-sm font-semibold" style={{ color: validationColor }}>{validationResult}</p>
        )}
      </div>
    </div>
  );
}

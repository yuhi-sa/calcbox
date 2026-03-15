'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { computeAllHashes } from './hash-logic';
import { copyToClipboard } from '@/lib/clipboard';
import { showToast } from '@/components/Toast';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<{ sha1: string; sha256: string; sha512: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const calculateHashes = useCallback(async (text: string) => {
    if (!text) { setHashes(null); return; }
    try {
      const result = await computeAllHashes(text);
      setHashes(result);
    } catch {
      setHashes({ sha1: 'エラー', sha256: 'エラー', sha512: 'エラー' });
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => calculateHashes(input), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [input, calculateHashes]);

  const copy = async (text: string) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? 'コピーしました' : 'コピーに失敗しました', ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">テキスト入力</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ハッシュを生成したいテキストを入力..."
          className="w-full h-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono resize-y"
        />
      </div>

      {hashes && (
        <div className="space-y-3">
          {(['sha1', 'sha256', 'sha512'] as const).map((algo) => (
            <div key={algo} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{algo.replace('sha', 'SHA-')}</span>
                <button onClick={() => copy(hashes[algo])} className="text-xs text-[var(--color-primary)] hover:underline">コピー</button>
              </div>
              <code className="text-xs break-all font-mono">{hashes[algo]}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

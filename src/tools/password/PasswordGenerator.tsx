'use client';

import { useState } from 'react';
import { generatePassword, evaluateStrength, buildCharset } from './password-logic';
import { copyToClipboard } from '@/lib/clipboard';
import { showToast } from '@/components/Toast';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = () => {
    if (length < 8 || length > 64) { alert('パスワード文字数は8〜64の範囲で入力してください。'); return; }
    if (count < 1 || count > 10) { alert('生成数は1〜10の範囲で入力してください。'); return; }

    const charset = buildCharset({ uppercase: useUppercase, lowercase: useLowercase, numbers: useNumbers, symbols: useSymbols });
    if (!charset) { alert('少なくとも1つの文字種を選択してください。'); return; }

    const pws: string[] = [];
    for (let i = 0; i < count; i++) pws.push(generatePassword(length, charset));
    setPasswords(pws);
  };

  const copy = async (text: string) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? 'コピーしました' : 'コピーに失敗しました', ok ? 'success' : 'error');
  };

  const charset = buildCharset({ uppercase: useUppercase, lowercase: useLowercase, numbers: useNumbers, symbols: useSymbols });
  const strength = charset ? evaluateStrength(length, charset.length) : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">文字数</label>
          <input type="number" min={8} max={64} value={length} onChange={(e) => setLength(parseInt(e.target.value) || 16)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">生成数</label>
          <input type="number" min={1} max={10} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">文字種</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useUppercase} onChange={() => setUseUppercase(!useUppercase)} /> 大文字 (A-Z)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useLowercase} onChange={() => setUseLowercase(!useLowercase)} /> 小文字 (a-z)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useNumbers} onChange={() => setUseNumbers(!useNumbers)} /> 数字 (0-9)</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useSymbols} onChange={() => setUseSymbols(!useSymbols)} /> 記号 (!@#...)</label>
        </div>
      </div>
      <button onClick={generate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">生成する</button>

      {passwords.length > 0 && (
        <div className="space-y-3 mt-4">
          {passwords.map((pw, i) => (
            <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono break-all">{pw}</code>
                <button onClick={() => copy(pw)} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs font-medium hover:opacity-90 shrink-0">コピー</button>
              </div>
              {strength && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">強度:</span>
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(strength.level / 4) * 100}%`, backgroundColor: strength.color }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

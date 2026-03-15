'use client';

import { useState } from 'react';
import { Permission, permissionsToResult, numericToResult, ChmodResult, digitToPermission } from './chmod-logic';

export default function ChmodCalculator() {
  const [numericInput, setNumericInput] = useState('755');
  const [owner, setOwner] = useState<Permission>({ read: true, write: true, execute: true });
  const [group, setGroup] = useState<Permission>({ read: true, write: false, execute: true });
  const [others, setOthers] = useState<Permission>({ read: true, write: false, execute: true });
  const [result, setResult] = useState<ChmodResult | null>(null);
  const [error, setError] = useState('');

  const calculateFromNumeric = () => {
    setError('');
    try {
      const r = numericToResult(numericInput);
      setResult(r);
      const digits = numericInput.split('').map(Number);
      setOwner(digitToPermission(digits[0]));
      setGroup(digitToPermission(digits[1]));
      setOthers(digitToPermission(digits[2]));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const calculateFromCheckboxes = () => {
    const r = permissionsToResult(owner, group, others);
    setResult(r);
    setNumericInput(r.numeric);
  };

  const togglePerm = (
    target: 'owner' | 'group' | 'others',
    field: keyof Permission
  ) => {
    const setters = { owner: setOwner, group: setGroup, others: setOthers };
    const values = { owner, group, others };
    setters[target]({ ...values[target], [field]: !values[target][field] });
  };

  const sections = [
    { label: 'オーナー', key: 'owner' as const, perm: owner },
    { label: 'グループ', key: 'group' as const, perm: group },
    { label: 'その他', key: 'others' as const, perm: others },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">数値入力</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={numericInput}
            onChange={(e) => setNumericInput(e.target.value)}
            maxLength={3}
            className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
            placeholder="755"
          />
          <button onClick={calculateFromNumeric} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
            変換
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-2">パーミッション選択</label>
        <div className="grid grid-cols-3 gap-4">
          {sections.map(({ label, key, perm }) => (
            <div key={key} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm font-medium mb-2">{label}</p>
              {(['read', 'write', 'execute'] as const).map((field) => (
                <label key={field} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={perm[field]}
                    onChange={() => togglePerm(key, field)}
                  />
                  {field === 'read' ? '読み取り (r)' : field === 'write' ? '書き込み (w)' : '実行 (x)'}
                </label>
              ))}
            </div>
          ))}
        </div>
        <button onClick={calculateFromCheckboxes} className="mt-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
          計算する
        </button>
      </div>

      {result && (
        <div className="space-y-2 mt-4">
          {([
            ['数値表記', result.numeric],
            ['シンボル表記', result.symbolic],
            ['ls形式', result.lsStyle],
          ] as const).map(([label, val]) => (
            <div key={label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
              <span className="text-sm font-medium">{label}</span>
              <code className="text-sm font-mono">{val}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

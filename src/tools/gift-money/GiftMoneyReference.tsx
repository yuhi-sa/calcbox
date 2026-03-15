'use client';

import { useState } from 'react';
import {
  calculateGiftMoney,
  getWeddingRelationships,
  getFuneralRelationships,
  GiftMoneyResult,
  OccasionType,
  Relationship,
} from './gift-money-logic';

export default function GiftMoneyReference() {
  const [occasion, setOccasion] = useState<OccasionType>('wedding');
  const [relationship, setRelationship] = useState<string>('');
  const [result, setResult] = useState<GiftMoneyResult | null>(null);

  const relationships = occasion === 'wedding' ? getWeddingRelationships() : getFuneralRelationships();

  const calculate = () => {
    if (!relationship) {
      alert('関係性を選択してください。');
      return;
    }
    setResult(calculateGiftMoney(occasion, relationship as Relationship));
  };

  const reset = () => {
    setOccasion('wedding');
    setRelationship('');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">場面</label>
          <select
            value={occasion}
            onChange={(e) => {
              setOccasion(e.target.value as OccasionType);
              setRelationship('');
              setResult(null);
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="wedding">ご祝儀（結婚式）</option>
            <option value="funeral">香典（葬儀）</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">関係性</label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="">選択してください</option>
            {relationships.map((rel) => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">調べる</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">{result.occasion} - {result.relationship}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-primary)' }}>{result.displayAmount}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm font-medium mb-2">マナー・注意点</p>
            <ul className="space-y-1">
              {result.notes.map((note, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">・{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

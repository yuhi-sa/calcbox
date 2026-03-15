'use client';

import { useState } from 'react';
import { BloodType, getCompatibility, getPersonality, CompatibilityResult, PersonalityTraits } from './blood-type-logic';

const BLOOD_TYPES: BloodType[] = ['A', 'B', 'O', 'AB'];

export default function BloodTypeCompatibility() {
  const [type1, setType1] = useState<BloodType>('A');
  const [type2, setType2] = useState<BloodType>('O');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [personality1, setPersonality1] = useState<PersonalityTraits | null>(null);
  const [personality2, setPersonality2] = useState<PersonalityTraits | null>(null);

  const calculate = () => {
    setResult(getCompatibility(type1, type2));
    setPersonality1(getPersonality(type1));
    setPersonality2(getPersonality(type2));
  };

  const reset = () => {
    setType1('A');
    setType2('O');
    setResult(null);
    setPersonality1(null);
    setPersonality2(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-yellow-500';
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">あなたの血液型</label>
            <select value={type1} onChange={(e) => setType1(e.target.value as BloodType)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              {BLOOD_TYPES.map((t) => (
                <option key={t} value={t}>{t}型</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">相手の血液型</label>
            <select value={type2} onChange={(e) => setType2(e.target.value as BloodType)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              {BLOOD_TYPES.map((t) => (
                <option key={t} value={t}>{t}型</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">診断する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && personality1 && personality2 && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">相性スコア</p>
            <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}点</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.comment}</p>
          </div>

          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">アドバイス</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{result.advice}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm font-semibold mb-1">{personality1.type}型の性格</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{personality1.description}</p>
              <div className="flex flex-wrap gap-1">
                {personality1.traits.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm font-semibold mb-1">{personality2.type}型の性格</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{personality2.description}</p>
              <div className="flex flex-wrap gap-1">
                {personality2.traits.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">※ これはエンターテイメントです。科学的根拠はありません。</p>
        </div>
      )}
    </div>
  );
}

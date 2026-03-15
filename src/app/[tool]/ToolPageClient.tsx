'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const toolComponents: Record<string, React.ComponentType> = {
  loan: dynamic(() => import('@/tools/loan/LoanCalculator')),
  bmi: dynamic(() => import('@/tools/bmi/BmiCalculator')),
  tax: dynamic(() => import('@/tools/tax/TaxCalculator')),
  salary: dynamic(() => import('@/tools/salary/SalaryCalculator')),
  currency: dynamic(() => import('@/tools/currency/CurrencyCalculator')),
  markdown: dynamic(() => import('@/tools/markdown/MarkdownPreview')),
  hash: dynamic(() => import('@/tools/hash/HashGenerator')),
  password: dynamic(() => import('@/tools/password/PasswordGenerator')),
  timestamp: dynamic(() => import('@/tools/timestamp/TimestampConverter')),
  uuid: dynamic(() => import('@/tools/uuid/UuidGenerator')),
};

interface ToolPageClientProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
}

export default function ToolPageClient({ toolId, toolName, toolDescription }: ToolPageClientProps) {
  const Component = toolComponents[toolId];

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline">&larr; ツール一覧に戻る</Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold mb-1">{toolName}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{toolDescription}</p>
        {Component ? <Component /> : <p>このツールは準備中です。</p>}
      </div>
    </div>
  );
}

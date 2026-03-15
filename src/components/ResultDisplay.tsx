'use client';

import { ReactNode } from 'react';

interface ResultDisplayProps {
  visible: boolean;
  children: ReactNode;
}

export default function ResultDisplay({ visible, children }: ResultDisplayProps) {
  if (!visible) return null;

  return (
    <div className="mt-6 p-5 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 animate-in fade-in duration-300">
      {children}
    </div>
  );
}

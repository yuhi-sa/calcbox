'use client';

import { useState } from 'react';
import { parseMarkdown } from './markdown-logic';
import { copyToClipboard } from '@/lib/clipboard';
import { showToast } from '@/components/Toast';

export default function MarkdownPreview() {
  const [input, setInput] = useState('');

  const html = parseMarkdown(input);

  const copyHtml = async () => {
    if (!html.trim()) { alert('プレビューが空です。マークダウンを入力してください。'); return; }
    const ok = await copyToClipboard(html);
    showToast(ok ? 'HTMLをコピーしました' : 'コピーに失敗しました', ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">マークダウン入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# タイトル&#10;&#10;テキストを入力..."
            className="w-full h-80 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono resize-y"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">プレビュー</label>
          <div
            className="w-full h-80 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm overflow-auto prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={copyHtml} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">HTMLをコピー</button>
        <button onClick={() => setInput('')} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
      </div>
    </div>
  );
}

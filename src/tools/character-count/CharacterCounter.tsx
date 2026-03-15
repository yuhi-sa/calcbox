'use client';

import { useState } from 'react';
import { countCharacters } from './character-count-logic';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const result = countCharacters(text);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">テキスト</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="ここにテキストを入力..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: '文字数', value: result.characters },
          { label: '文字数（空白除く）', value: result.charactersNoSpaces },
          { label: '単語数', value: result.words },
          { label: '行数', value: result.lines },
          { label: 'バイト数（UTF-8）', value: result.bytes },
          { label: '段落数', value: result.paragraphs },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className="text-xl font-bold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

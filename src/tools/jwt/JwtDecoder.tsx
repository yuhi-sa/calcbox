'use client';

import { useState } from 'react';
import { decodeJwt, JwtDecodeResult } from './jwt-logic';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<JwtDecodeResult | null>(null);
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    try {
      setResult(decodeJwt(token));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">JWTトークン</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-mono"
          placeholder="eyJhbGciOiJIUzI1NiIs..."
        />
      </div>

      <button onClick={decode} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        デコードする
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-sm font-medium mb-1">ヘッダー</h3>
            <pre className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm font-mono overflow-x-auto">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">ペイロード</h3>
            <pre className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm font-mono overflow-x-auto">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-sm font-medium mb-1">署名</h3>
            <code className="text-sm font-mono break-all text-gray-500">{result.signature}</code>
          </div>
          {result.expiresAt && (
            <div className={`p-3 rounded-lg ${result.isExpired ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
              <span className="text-sm font-medium">
                {result.isExpired ? '期限切れ' : '有効'}
              </span>
              <span className="text-sm text-gray-500 ml-2">({result.expiresAt})</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

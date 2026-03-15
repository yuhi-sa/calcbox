'use client';

import { useState } from 'react';
import { parseCidr, calculateSubnet, IpCalcResult } from './ip-calc-logic';

export default function IpCalculator() {
  const [input, setInput] = useState('192.168.1.0/24');
  const [result, setResult] = useState<IpCalcResult | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    try {
      const { ip, cidr } = parseCidr(input);
      setResult(calculateSubnet(ip, cidr));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">CIDR表記</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          placeholder="192.168.1.0/24"
        />
      </div>

      <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        計算する
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {result && (
        <div className="space-y-2 mt-4">
          {([
            ['ネットワークアドレス', result.networkAddress],
            ['ブロードキャストアドレス', result.broadcastAddress],
            ['最初のホスト', result.firstHost],
            ['最後のホスト', result.lastHost],
            ['ホスト数', result.numberOfHosts.toLocaleString()],
            ['サブネットマスク', result.subnetMask],
            ['CIDR', `/${result.cidr}`],
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

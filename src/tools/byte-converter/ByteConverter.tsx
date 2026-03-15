'use client';

import { useState } from 'react';
import { convertBytes, BYTE_UNITS, ByteUnit, ByteConversionResult } from './byte-converter-logic';

export default function ByteConverter() {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState<ByteUnit>('GB');
  const [result, setResult] = useState<ByteConversionResult | null>(null);

  const convert = () => {
    setResult(convertBytes(value, fromUnit));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">値</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">単位</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as ByteUnit)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            {BYTE_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
        変換する
      </button>

      {result && (
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">2進接頭辞 (1KB = 1024B)</h3>
            <div className="space-y-1">
              {BYTE_UNITS.map((unit) => (
                <div key={unit} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                  <span className="text-sm font-medium">{unit}</span>
                  <code className="text-sm font-mono">{result.binary[unit]}</code>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">SI接頭辞 (1KB = 1000B)</h3>
            <div className="space-y-1">
              {BYTE_UNITS.map((unit) => (
                <div key={unit} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                  <span className="text-sm font-medium">{unit}</span>
                  <code className="text-sm font-mono">{result.si[unit]}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { fallbackRates, currencyNames, convert, formatCurrencyNumber } from './currency-logic';

interface ConversionResult {
  fromDisplay: string;
  toDisplay: string;
  rateDisplay: string;
}

export default function CurrencyCalculator() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('JPY');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rates, setRates] = useState(fallbackRates);
  const [rateSource, setRateSource] = useState<'api' | 'fallback'>('fallback');
  const [result, setResult] = useState<ConversionResult | null>(null);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((res) => { if (!res.ok) throw new Error('fail'); return res.json(); })
      .then((data) => {
        if (data?.rates) {
          const newRates: Record<string, number> = {};
          for (const code of Object.keys(fallbackRates)) {
            newRates[code] = data.rates[code] ?? fallbackRates[code];
          }
          setRates(newRates);
          setRateSource('api');
        }
      })
      .catch(() => { setRateSource('fallback'); });
  }, []);

  const calculate = () => {
    const a = parseFloat(amount);
    if (!a || a <= 0) { alert('正の金額を入力してください。'); return; }
    if (fromCurrency === toCurrency) { alert('異なる通貨を選択してください。'); return; }

    const converted = convert(a, fromCurrency, toCurrency, rates);
    const rate = convert(1, fromCurrency, toCurrency, rates);

    setResult({
      fromDisplay: formatCurrencyNumber(a, fromCurrency) + ' ' + fromCurrency,
      toDisplay: formatCurrencyNumber(converted, toCurrency) + ' ' + toCurrency,
      rateDisplay: '1 ' + fromCurrency + ' = ' + formatCurrencyNumber(rate, toCurrency) + ' ' + toCurrency,
    });
  };

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const reset = () => { setAmount(''); setResult(null); };
  const currencies = Object.keys(fallbackRates);

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">金額</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="例: 10000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">変換元</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              {currencies.map((c) => <option key={c} value={c}>{currencyNames[c]}</option>)}
            </select>
          </div>
          <button onClick={swap} className="px-3 py-2 text-[var(--color-primary)] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" aria-label="通貨を入れ替え">⇄</button>
          <div>
            <label className="block text-sm font-medium mb-1">変換先</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
              {currencies.map((c) => <option key={c} value={c}>{currencyNames[c]}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">変換する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-400">{result.fromDisplay}</p>
          <p className="text-3xl font-bold text-[var(--color-primary)]">{result.toDisplay}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{result.rateDisplay}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        {rateSource === 'api' ? '※ APIからリアルタイムレートを取得しています。実際の取引レートとは異なる場合があります。' : '※ レートは概算値です（API取得に失敗）。実際の取引レートとは異なります。'}
      </p>
    </div>
  );
}

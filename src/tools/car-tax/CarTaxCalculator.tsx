'use client';

import { useState } from 'react';
import { calculateCarTax, CarTaxResult, VehicleType } from './car-tax-logic';

export default function CarTaxCalculator() {
  const [vehicleType, setVehicleType] = useState<VehicleType>('普通車');
  const [displacement, setDisplacement] = useState('');
  const [isOver13, setIsOver13] = useState(false);
  const [result, setResult] = useState<CarTaxResult | null>(null);

  const calculate = () => {
    const cc = parseInt(displacement);
    if (vehicleType === '普通車' && (!cc || cc < 1 || cc > 10000)) {
      alert('排気量を正しく入力してください（1〜10000cc）。');
      return;
    }
    const disp = vehicleType === '軽自動車' ? 660 : cc;
    setResult(calculateCarTax(vehicleType, disp, isOver13));
  };

  const reset = () => {
    setVehicleType('普通車');
    setDisplacement('');
    setIsOver13(false);
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">車種</label>
          <select
            value={vehicleType}
            onChange={(e) => {
              setVehicleType(e.target.value as VehicleType);
              setResult(null);
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="普通車">普通車</option>
            <option value="軽自動車">軽自動車</option>
          </select>
        </div>
        {vehicleType === '普通車' && (
          <div>
            <label className="block text-sm font-medium mb-1">排気量（cc）</label>
            <input type="number" value={displacement} onChange={(e) => setDisplacement(e.target.value)} placeholder="例: 2000" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="over13" checked={isOver13} onChange={(e) => setIsOver13(e.target.checked)} className="rounded" />
          <label htmlFor="over13" className="text-sm">新車登録から13年超（重課対象）</label>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">年間自動車税額</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{result.displayTax}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">車種</p>
              <p className="text-base font-semibold">{result.vehicleType}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">税率区分</p>
              <p className="text-base font-semibold">{result.bracket}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">基本税額</p>
              <p className="text-base font-semibold">{result.baseTax.toLocaleString()}円</p>
            </div>
            {result.isOverAge && (
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">重課加算（+15%）</p>
                <p className="text-base font-semibold text-red-500">+{result.surcharge.toLocaleString()}円</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

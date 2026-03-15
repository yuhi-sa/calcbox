'use client';

import { useState } from 'react';
import { calculateCarInspection, CarInspectionResult, VehicleType } from './car-inspection-logic';

export default function CarInspectionCalculator() {
  const [registrationDate, setRegistrationDate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('新車');
  const [result, setResult] = useState<CarInspectionResult | null>(null);

  const calculate = () => {
    if (!registrationDate) {
      alert('初度登録日を入力してください。');
      return;
    }
    setResult(calculateCarInspection({ registrationDate, vehicleType }));
  };

  const reset = () => {
    setRegistrationDate('');
    setVehicleType('新車');
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">初度登録日</label>
          <input type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">車両タイプ</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value as VehicleType)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
            <option value="新車">新車</option>
            <option value="普通車">普通車（中古）</option>
            <option value="軽自動車">軽自動車（中古）</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
          <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">次回車検日</p>
            <p className="text-3xl font-bold text-orange-500">{result.nextInspectionDate}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">残り <span className="font-semibold text-orange-500">{result.daysRemaining}</span> 日</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">今後の車検スケジュール</p>
            <ul className="space-y-1">
              {result.upcomingInspections.map((insp, i) => (
                <li key={i} className="text-sm flex justify-between">
                  <span>{insp.label}</span>
                  <span className="font-semibold">{insp.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

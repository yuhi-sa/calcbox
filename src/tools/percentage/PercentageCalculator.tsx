'use client';

import { useState } from 'react';
import { percentOf, whatPercentOf, percentChange, increaseByPercent, decreaseByPercent } from './percentage-logic';

export default function PercentageCalculator() {
  const [pofX, setPofX] = useState('');
  const [pofY, setPofY] = useState('');
  const [wpX, setWpX] = useState('');
  const [wpY, setWpY] = useState('');
  const [pcFrom, setPcFrom] = useState('');
  const [pcTo, setPcTo] = useState('');
  const [ibX, setIbX] = useState('');
  const [ibY, setIbY] = useState('');

  const inputClass = 'w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center';
  const resultClass = 'p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800';

  const pofResult = pofX && pofY ? percentOf(parseFloat(pofX), parseFloat(pofY)) : null;
  const wpResult = wpX && wpY ? whatPercentOf(parseFloat(wpX), parseFloat(wpY)) : null;
  const pcResult = pcFrom && pcTo ? percentChange(parseFloat(pcFrom), parseFloat(pcTo)) : null;
  const incResult = ibX && ibY ? increaseByPercent(parseFloat(ibX), parseFloat(ibY)) : null;
  const decResult = ibX && ibY ? decreaseByPercent(parseFloat(ibX), parseFloat(ibY)) : null;

  return (
    <div className="space-y-6">
      {/* X% of Y */}
      <div className={resultClass}>
        <p className="text-sm font-medium mb-2">X% of Y（XのY%）</p>
        <div className="flex items-center gap-2 flex-wrap">
          <input type="number" value={pofX} onChange={(e) => setPofX(e.target.value)} placeholder="X" className={inputClass} />
          <span className="text-sm">% of</span>
          <input type="number" value={pofY} onChange={(e) => setPofY(e.target.value)} placeholder="Y" className={inputClass} />
          <span className="text-sm">=</span>
          <span className="text-lg font-bold">{pofResult !== null && !isNaN(pofResult) ? pofResult.toFixed(2) : '?'}</span>
        </div>
      </div>

      {/* X is what % of Y */}
      <div className={resultClass}>
        <p className="text-sm font-medium mb-2">X is what % of Y（XはYの何%）</p>
        <div className="flex items-center gap-2 flex-wrap">
          <input type="number" value={wpX} onChange={(e) => setWpX(e.target.value)} placeholder="X" className={inputClass} />
          <span className="text-sm">is</span>
          <input type="number" value={wpY} onChange={(e) => setWpY(e.target.value)} placeholder="Y" className={inputClass} />
          <span className="text-sm">の</span>
          <span className="text-lg font-bold">
            {wpX && wpY && parseFloat(wpY) === 0
              ? <span className="text-red-500 text-sm">Yは0以外を入力</span>
              : wpResult !== null && !isNaN(wpResult) ? wpResult.toFixed(2) + '%' : '?%'}
          </span>
        </div>
      </div>

      {/* % change from X to Y */}
      <div className={resultClass}>
        <p className="text-sm font-medium mb-2">% change from X to Y（変化率）</p>
        <div className="flex items-center gap-2 flex-wrap">
          <input type="number" value={pcFrom} onChange={(e) => setPcFrom(e.target.value)} placeholder="From" className={inputClass} />
          <span className="text-sm">→</span>
          <input type="number" value={pcTo} onChange={(e) => setPcTo(e.target.value)} placeholder="To" className={inputClass} />
          <span className="text-sm">=</span>
          <span className="text-lg font-bold" style={{ color: pcResult !== null && !isNaN(pcResult) ? (pcResult >= 0 ? '#22c55e' : '#ef4444') : undefined }}>
            {pcFrom && parseFloat(pcFrom) === 0
              ? <span className="text-red-500 text-sm" style={{ color: '#ef4444' }}>From は0以外を入力</span>
              : pcResult !== null && !isNaN(pcResult) ? (pcResult >= 0 ? '+' : '') + pcResult.toFixed(2) + '%' : '?%'}
          </span>
        </div>
      </div>

      {/* Increase / Decrease by Y% */}
      <div className={resultClass}>
        <p className="text-sm font-medium mb-2">X increased / decreased by Y%（増減）</p>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <input type="number" value={ibX} onChange={(e) => setIbX(e.target.value)} placeholder="X" className={inputClass} />
          <span className="text-sm">を</span>
          <input type="number" value={ibY} onChange={(e) => setIbY(e.target.value)} placeholder="Y%" className={inputClass} />
          <span className="text-sm">%</span>
        </div>
        <div className="flex gap-4 mt-2">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">増加: </span>
            <span className="text-lg font-bold">{incResult !== null && !isNaN(incResult) ? incResult.toFixed(2) : '?'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">減少: </span>
            <span className="text-lg font-bold">{decResult !== null && !isNaN(decResult) ? decResult.toFixed(2) : '?'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

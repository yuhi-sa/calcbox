'use client';

import { useState, useRef, useEffect } from 'react';
import { formatElapsed, calculateLap, LapEntry } from './stopwatch-logic';

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<LapEntry[]>([]);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  const tick = () => {
    const now = performance.now();
    setElapsed(accumulatedRef.current + (now - startTimeRef.current));
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    startTimeRef.current = performance.now();
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    accumulatedRef.current = elapsed;
    setRunning(false);
  };

  const lap = () => {
    const entry = calculateLap(Math.floor(elapsed), laps);
    setLaps([...laps, entry]);
  };

  const reset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    accumulatedRef.current = 0;
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div>
      <div className="text-center mb-6">
        <p className="text-5xl font-bold font-mono text-orange-600 dark:text-orange-400">
          {formatElapsed(Math.floor(elapsed))}
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {!running ? (
          <button onClick={start} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
            {elapsed > 0 ? '再開' : 'スタート'}
          </button>
        ) : (
          <button onClick={stop} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:opacity-90">ストップ</button>
        )}
        {running && (
          <button onClick={lap} className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:opacity-90">ラップ</button>
        )}
        <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
      </div>

      {laps.length > 0 && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 py-2 text-left">ラップ</th>
                <th className="px-3 py-2 text-right">ラップタイム</th>
                <th className="px-3 py-2 text-right">累計</th>
              </tr>
            </thead>
            <tbody>
              {[...laps].reverse().map((entry) => (
                <tr key={entry.lapNumber} className="border-t border-gray-200 dark:border-gray-600">
                  <td className="px-3 py-2">{entry.lapNumber}</td>
                  <td className="px-3 py-2 text-right font-mono">{entry.lapTimeFormatted}</td>
                  <td className="px-3 py-2 text-right font-mono">{entry.cumulativeFormatted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

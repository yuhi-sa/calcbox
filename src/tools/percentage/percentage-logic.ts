export interface PercentageResults {
  percentOfValue: number | null;
  whatPercent: number | null;
  percentChange: number | null;
  increasedValue: number | null;
  decreasedValue: number | null;
}

/** Calculate X% of Y */
export function percentOf(x: number, y: number): number {
  return (x / 100) * y;
}

/** X is what percent of Y */
export function whatPercentOf(x: number, y: number): number {
  if (y === 0) return 0;
  return (x / y) * 100;
}

/** Percentage change from X to Y */
export function percentChange(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / Math.abs(from)) * 100;
}

/** X increased by Y% */
export function increaseByPercent(x: number, y: number): number {
  return x * (1 + y / 100);
}

/** X decreased by Y% */
export function decreaseByPercent(x: number, y: number): number {
  return x * (1 - y / 100);
}

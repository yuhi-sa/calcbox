export interface StatisticsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
}

export function parseNumbers(input: string): number[] {
  return input
    .split(/[,\n\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !isNaN(n));
}

export function calculateStatistics(numbers: number[]): StatisticsResult | null {
  if (numbers.length === 0) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = numbers.length;
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / count;
  const median = calculateMedian(sorted);
  const mode = calculateMode(numbers);
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;
  const variance = numbers.reduce((acc, n) => acc + (n - mean) ** 2, 0) / count;
  const standardDeviation = Math.sqrt(variance);

  return { count, sum, mean, median, mode, min, max, range, variance, standardDeviation };
}

export function calculateMedian(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function calculateMode(numbers: number[]): number[] {
  const freq = new Map<number, number>();
  for (const n of numbers) {
    freq.set(n, (freq.get(n) ?? 0) + 1);
  }
  const maxFreq = Math.max(...freq.values());
  if (maxFreq === 1) return []; // no mode
  return [...freq.entries()].filter(([, v]) => v === maxFreq).map(([k]) => k).sort((a, b) => a - b);
}

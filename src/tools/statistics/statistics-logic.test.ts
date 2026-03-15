import { describe, it, expect } from 'vitest';
import { parseNumbers, calculateStatistics, calculateMedian, calculateMode } from './statistics-logic';

describe('statistics', () => {
  it('parses comma-separated numbers', () => {
    expect(parseNumbers('1, 2, 3, 4, 5')).toEqual([1, 2, 3, 4, 5]);
  });

  it('parses newline-separated numbers', () => {
    expect(parseNumbers('10\n20\n30')).toEqual([10, 20, 30]);
  });

  it('ignores invalid entries', () => {
    expect(parseNumbers('1, abc, 3')).toEqual([1, 3]);
  });

  it('calculates basic statistics', () => {
    const result = calculateStatistics([1, 2, 3, 4, 5]);
    expect(result).not.toBeNull();
    expect(result!.count).toBe(5);
    expect(result!.sum).toBe(15);
    expect(result!.mean).toBe(3);
    expect(result!.median).toBe(3);
    expect(result!.min).toBe(1);
    expect(result!.max).toBe(5);
    expect(result!.range).toBe(4);
    expect(result!.variance).toBe(2);
    expect(result!.standardDeviation).toBeCloseTo(1.4142, 3);
  });

  it('calculates median for even count', () => {
    expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
  });

  it('calculates mode', () => {
    expect(calculateMode([1, 2, 2, 3, 3])).toEqual([2, 3]);
    expect(calculateMode([1, 1, 2, 3])).toEqual([1]);
    expect(calculateMode([1, 2, 3])).toEqual([]); // no mode
  });

  it('returns null for empty array', () => {
    expect(calculateStatistics([])).toBeNull();
  });
});

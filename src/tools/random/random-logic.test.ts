import { describe, it, expect } from 'vitest';
import { generateRandomInt, generateRandomNumbers, pickFromList } from './random-logic';

describe('random generation', () => {
  it('generates integer within range', () => {
    for (let i = 0; i < 100; i++) {
      const n = generateRandomInt(1, 10);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(10);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it('generates correct count of numbers', () => {
    const result = generateRandomNumbers(1, 100, 5);
    expect(result).toHaveLength(5);
  });

  it('generates unique numbers when flag is set', () => {
    const result = generateRandomNumbers(1, 10, 10, true);
    expect(result).toHaveLength(10);
    expect(new Set(result).size).toBe(10);
  });

  it('throws when unique count exceeds range', () => {
    expect(() => generateRandomNumbers(1, 5, 10, true)).toThrow();
  });

  it('throws when min > max', () => {
    expect(() => generateRandomNumbers(10, 1, 5)).toThrow();
  });

  it('picks from list correctly', () => {
    const list = ['A', 'B', 'C'];
    const result = pickFromList(list, 2);
    expect(result).toHaveLength(2);
    result.forEach((item) => {
      expect(list).toContain(item);
    });
  });

  it('throws for empty list', () => {
    expect(() => pickFromList([])).toThrow();
  });

  it('generates single number when count is 1', () => {
    const result = generateRandomNumbers(5, 5, 1);
    expect(result).toEqual([5]);
  });
});

import { describe, it, expect } from 'vitest';
import { calcWarikan, calcWeightedWarikan, roundAmount } from './warikan-logic';

describe('warikan calculations', () => {
  it('splits evenly with no remainder', () => {
    const result = calcWarikan(3000, 3);
    expect(result.perPerson).toBe(1000);
    expect(result.remainder).toBe(0);
  });

  it('splits with remainder using floor rounding', () => {
    const result = calcWarikan(1000, 3, 'floor');
    expect(result.perPerson).toBe(333);
    expect(result.remainder).toBe(1);
  });

  it('splits with remainder using ceil rounding', () => {
    const result = calcWarikan(1000, 3, 'ceil');
    expect(result.perPerson).toBe(334);
    expect(result.remainder).toBe(-2);
  });

  it('splits with remainder using round', () => {
    const result = calcWarikan(1000, 3, 'round');
    expect(result.perPerson).toBe(333);
    expect(result.remainder).toBe(1);
  });

  it('throws for zero people', () => {
    expect(() => calcWarikan(1000, 0)).toThrow();
  });

  it('weighted split distributes proportionally', () => {
    const result = calcWeightedWarikan(10000, [2, 1, 1], 'floor');
    expect(result.amounts[0]).toBe(5000);
    expect(result.amounts[1]).toBe(2500);
    expect(result.amounts[2]).toBe(2500);
    expect(result.remainder).toBe(0);
  });

  it('weighted split handles remainder', () => {
    const result = calcWeightedWarikan(10000, [3, 2, 1], 'floor');
    const sum = result.amounts.reduce((a, b) => a + b, 0);
    expect(result.remainder).toBe(10000 - sum);
  });

  it('roundAmount works correctly', () => {
    expect(roundAmount(3.3, 'floor')).toBe(3);
    expect(roundAmount(3.3, 'ceil')).toBe(4);
    expect(roundAmount(3.5, 'round')).toBe(4);
  });
});

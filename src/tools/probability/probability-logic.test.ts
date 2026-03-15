import { describe, it, expect } from 'vitest';
import { factorial, permutation, combination, calculate } from './probability-logic';

describe('probability', () => {
  it('calculates factorial correctly', () => {
    expect(factorial(0)).toBe(1n);
    expect(factorial(1)).toBe(1n);
    expect(factorial(5)).toBe(120n);
    expect(factorial(10)).toBe(3628800n);
  });

  it('calculates permutation correctly', () => {
    expect(permutation(5, 2)).toBe(20n);
    expect(permutation(10, 3)).toBe(720n);
    expect(permutation(5, 0)).toBe(1n);
    expect(permutation(5, 5)).toBe(120n);
  });

  it('calculates combination correctly', () => {
    expect(combination(5, 2)).toBe(10n);
    expect(combination(10, 3)).toBe(120n);
    expect(combination(5, 0)).toBe(1n);
    expect(combination(5, 5)).toBe(1n);
  });

  it('throws error for invalid inputs', () => {
    expect(() => factorial(-1)).toThrow();
    expect(() => permutation(3, 5)).toThrow();
    expect(() => combination(3, 5)).toThrow();
  });

  it('handles large numbers with BigInt', () => {
    const result = factorial(20);
    expect(result).toBe(2432902008176640000n);
  });

  it('calculate dispatches correctly', () => {
    expect(calculate('factorial', 5, 0)).toBe(120n);
    expect(calculate('permutation', 5, 2)).toBe(20n);
    expect(calculate('combination', 5, 2)).toBe(10n);
  });
});

import { describe, it, expect } from 'vitest';
import { calcDiscount } from './discount-logic';

describe('discount calculations', () => {
  it('calculates single discount correctly', () => {
    const result = calcDiscount(1000, 20);
    expect(result.discountedPrice).toBe(800);
    expect(result.savings).toBe(200);
    expect(result.effectiveRate).toBeCloseTo(20);
  });

  it('calculates double discount correctly', () => {
    const result = calcDiscount(10000, 20, 10);
    // 10000 * 0.8 * 0.9 = 7200
    expect(result.discountedPrice).toBe(7200);
    expect(result.savings).toBe(2800);
    expect(result.effectiveRate).toBeCloseTo(28);
  });

  it('handles 0% discount', () => {
    const result = calcDiscount(5000, 0);
    expect(result.discountedPrice).toBe(5000);
    expect(result.savings).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it('handles 100% discount', () => {
    const result = calcDiscount(5000, 100);
    expect(result.discountedPrice).toBe(0);
    expect(result.savings).toBe(5000);
    expect(result.effectiveRate).toBeCloseTo(100);
  });

  it('throws for negative price', () => {
    expect(() => calcDiscount(-100, 10)).toThrow();
  });

  it('throws for invalid discount rate', () => {
    expect(() => calcDiscount(1000, 150)).toThrow();
  });

  it('double discount effective rate is less than sum of individual rates', () => {
    const result = calcDiscount(10000, 30, 20);
    // Effective rate: 1 - 0.7*0.8 = 1 - 0.56 = 0.44 = 44%
    expect(result.effectiveRate).toBeCloseTo(44);
    expect(result.effectiveRate).toBeLessThan(50); // less than 30+20
  });
});

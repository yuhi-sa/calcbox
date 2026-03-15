import { describe, it, expect } from 'vitest';
import { calcCompoundInterest } from './compound-interest-logic';

describe('calcCompoundInterest', () => {
  it('calculates with no monthly contribution', () => {
    const result = calcCompoundInterest(1000000, 0, 5, 10);
    // 5% annual rate compounded monthly for 10 years
    expect(result.finalAmount).toBeGreaterThan(1000000);
    expect(result.totalContributions).toBe(1000000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.yearlyBreakdown).toHaveLength(10);
  });

  it('calculates with monthly contributions and interest', () => {
    const result = calcCompoundInterest(0, 10000, 5, 10);
    expect(result.finalAmount).toBeGreaterThan(10000 * 12 * 10);
    expect(result.totalContributions).toBe(10000 * 12 * 10);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.yearlyBreakdown).toHaveLength(10);
  });

  it('calculates with initial amount and contributions', () => {
    const result = calcCompoundInterest(1000000, 30000, 3, 20);
    expect(result.finalAmount).toBeGreaterThan(1000000 + 30000 * 12 * 20);
    expect(result.totalContributions).toBe(1000000 + 30000 * 12 * 20);
    expect(result.yearlyBreakdown).toHaveLength(20);
  });

  it('yearly breakdown balance increases over time', () => {
    const result = calcCompoundInterest(100000, 10000, 5, 5);
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].balance).toBeGreaterThan(
        result.yearlyBreakdown[i - 1].balance
      );
    }
  });

  it('handles 0% interest rate correctly', () => {
    const result = calcCompoundInterest(500000, 20000, 0, 5);
    expect(result.finalAmount).toBe(500000 + 20000 * 12 * 5);
    expect(result.totalInterest).toBe(0);
  });
});

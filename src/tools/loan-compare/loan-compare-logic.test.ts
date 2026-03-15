import { describe, it, expect } from 'vitest';
import { calcLoanCompare } from './loan-compare-logic';

describe('calcLoanCompare', () => {
  it('compares multiple loans', () => {
    const result = calcLoanCompare([
      { principal: 30000000, annualRate: 1.0, termYears: 35 },
      { principal: 30000000, annualRate: 1.5, termYears: 35 },
      { principal: 30000000, annualRate: 2.0, termYears: 35 },
    ]);
    expect(result.entries).toHaveLength(3);
    expect(result.bestIndex).toBe(0); // lowest rate = lowest total payment
  });

  it('marks the best option correctly', () => {
    const result = calcLoanCompare([
      { principal: 30000000, annualRate: 2.0, termYears: 35 },
      { principal: 30000000, annualRate: 1.0, termYears: 35 },
    ]);
    expect(result.entries[1].isBest).toBe(true);
    expect(result.entries[0].isBest).toBe(false);
    expect(result.bestIndex).toBe(1);
  });

  it('lower rate means less total interest', () => {
    const result = calcLoanCompare([
      { principal: 20000000, annualRate: 0.5, termYears: 30 },
      { principal: 20000000, annualRate: 2.0, termYears: 30 },
    ]);
    expect(result.entries[0].totalInterest).toBeLessThan(result.entries[1].totalInterest);
  });

  it('handles single loan', () => {
    const result = calcLoanCompare([
      { principal: 10000000, annualRate: 1.0, termYears: 10 },
    ]);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].isBest).toBe(true);
  });

  it('handles 0% interest rate', () => {
    const result = calcLoanCompare([
      { principal: 10000000, annualRate: 0, termYears: 10 },
    ]);
    expect(result.entries[0].totalInterest).toBe(0);
    expect(result.entries[0].totalPayment).toBe(10000000);
  });
});

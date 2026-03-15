import { describe, it, expect } from 'vitest';
import { calcLoan } from './loan-logic';

describe('calcLoan', () => {
  it('calculates equal-payment loan correctly', () => {
    const result = calcLoan(3000, 1.5, 35, 'equal-payment');
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(3000 * 10000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.yearlyData).toHaveLength(35);
    expect(result.yearlyData[34].balance).toBeCloseTo(0, 0);
  });

  it('calculates equal-principal loan correctly', () => {
    const result = calcLoan(3000, 1.5, 35, 'equal-principal');
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(3000 * 10000);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.yearlyData).toHaveLength(35);
    expect(result.yearlyData[34].balance).toBeCloseTo(0, 0);
  });

  it('equal-principal has less total interest than equal-payment', () => {
    const ep = calcLoan(3000, 1.5, 35, 'equal-payment');
    const epr = calcLoan(3000, 1.5, 35, 'equal-principal');
    expect(epr.totalInterest).toBeLessThan(ep.totalInterest);
  });

  it('handles 0% interest rate', () => {
    const result = calcLoan(1000, 0, 10, 'equal-payment');
    expect(result.totalInterest).toBeCloseTo(0, 0);
    expect(result.totalPayment).toBeCloseTo(1000 * 10000, 0);
  });
});

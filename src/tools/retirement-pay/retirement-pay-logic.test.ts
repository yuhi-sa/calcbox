import { describe, it, expect } from 'vitest';
import { getCoefficient, getTypeMultiplier, calcRetirementDeduction, calculateRetirementPay } from './retirement-pay-logic';

describe('Retirement Pay Estimator', () => {
  it('returns correct coefficients by years of service', () => {
    expect(getCoefficient(0)).toBe(0);
    expect(getCoefficient(2)).toBe(0.75);
    expect(getCoefficient(5)).toBe(1.5);
    expect(getCoefficient(10)).toBe(4.0);
    expect(getCoefficient(20)).toBe(10.0);
    expect(getCoefficient(30)).toBe(17.5);
    expect(getCoefficient(35)).toBe(22.5);
  });

  it('applies correct multiplier by retirement type', () => {
    expect(getTypeMultiplier('自己都合')).toBe(0.6);
    expect(getTypeMultiplier('会社都合')).toBe(1.0);
    expect(getTypeMultiplier('定年')).toBe(1.0);
  });

  it('calculates retirement deduction correctly', () => {
    // 10 years: 400,000 * 10 = 4,000,000
    expect(calcRetirementDeduction(10)).toBe(4000000);
    // 1 year: max(400,000, 800,000) = 800,000
    expect(calcRetirementDeduction(1)).toBe(800000);
    // 25 years: 8,000,000 + 700,000 * 5 = 11,500,000
    expect(calcRetirementDeduction(25)).toBe(11500000);
  });

  it('calculates gross pay for 自己都合 退職', () => {
    const result = calculateRetirementPay(300000, 10, '自己都合');
    // 300,000 * 4.0 * 0.6 = 720,000
    expect(result.grossPay).toBe(720000);
    expect(result.typeMultiplier).toBe(0.6);
  });

  it('calculates gross pay for 定年 退職', () => {
    const result = calculateRetirementPay(400000, 30, '定年');
    // 400,000 * 17.5 * 1.0 = 7,000,000
    expect(result.grossPay).toBe(7000000);
    expect(result.retirementType).toBe('定年');
    // Deduction (15M) > gross (7M), so no tax
    expect(result.netPay).toBe(result.grossPay);
  });
});

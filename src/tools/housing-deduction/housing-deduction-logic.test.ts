import { describe, it, expect } from 'vitest';
import { calcHousingDeduction } from './housing-deduction-logic';

describe('calcHousingDeduction', () => {
  it('calculates 13 years of deductions', () => {
    const result = calcHousingDeduction(30000000, 1.0, 35, 'general');
    expect(result.yearlyDeductions).toHaveLength(13);
    expect(result.maxDeductionYears).toBe(13);
  });

  it('deductions decrease over time as balance decreases', () => {
    const result = calcHousingDeduction(30000000, 1.5, 35, 'general');
    expect(result.yearlyDeductions[0].deduction).toBeGreaterThan(
      result.yearlyDeductions[12].deduction
    );
  });

  it('uses correct balance cap for general housing', () => {
    const result = calcHousingDeduction(50000000, 1.0, 35, 'general');
    expect(result.balanceCap).toBe(30000000);
    // Deduction should be capped
    result.yearlyDeductions.forEach((d) => {
      expect(d.deduction).toBeLessThanOrEqual(Math.floor(30000000 * 0.007));
    });
  });

  it('uses correct balance cap for energy-efficient housing', () => {
    const result = calcHousingDeduction(50000000, 1.0, 35, 'energy-efficient');
    expect(result.balanceCap).toBe(35000000);
    expect(result.houseTypeLabel).toBe('省エネ住宅');
  });

  it('total deduction is sum of yearly deductions', () => {
    const result = calcHousingDeduction(25000000, 1.0, 30, 'general');
    const sum = result.yearlyDeductions.reduce((acc, d) => acc + d.deduction, 0);
    expect(result.totalDeduction).toBe(sum);
  });
});

import { describe, it, expect } from 'vitest';
import { calcFurusatoTax, getBaseDeduction } from './furusato-tax-logic';

describe('getBaseDeduction', () => {
  it('returns correct deduction for 500万 income', () => {
    expect(getBaseDeduction(5000000)).toBe(61000);
  });

  it('returns correct deduction for 300万 income', () => {
    expect(getBaseDeduction(3000000)).toBe(28000);
  });

  it('returns 0 for 0 income', () => {
    expect(getBaseDeduction(0)).toBe(0);
  });

  it('returns extrapolated value for income over 2000万', () => {
    const result = getBaseDeduction(30000000);
    expect(result).toBeGreaterThan(564000);
  });
});

describe('calcFurusatoTax', () => {
  it('calculates for single person', () => {
    const result = calcFurusatoTax(5000000, 'single');
    expect(result.maxDeduction).toBe(61000);
    expect(result.selfBurden).toBe(2000);
    expect(result.effectiveBenefit).toBe(59000);
  });

  it('reduces deduction for married with children', () => {
    const single = calcFurusatoTax(7000000, 'single');
    const married2 = calcFurusatoTax(7000000, 'married_2children');
    expect(married2.maxDeduction).toBeLessThan(single.maxDeduction);
  });

  it('returns correct family label', () => {
    const result = calcFurusatoTax(5000000, 'married_1child');
    expect(result.familyLabel).toBe('夫婦+子1人');
  });

  it('married adjustment is 90%', () => {
    const result = calcFurusatoTax(5000000, 'married');
    expect(result.maxDeduction).toBe(Math.round(61000 * 0.9));
  });
});

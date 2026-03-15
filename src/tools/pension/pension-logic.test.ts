import { describe, it, expect } from 'vitest';
import { calcPension, calcNationalPension, calcEmployeePension } from './pension-logic';

describe('calcNationalPension', () => {
  it('returns full amount for 480 months', () => {
    expect(calcNationalPension(480)).toBe(795000);
  });

  it('returns half for 240 months', () => {
    expect(calcNationalPension(240)).toBe(Math.round(795000 * (240 / 480)));
  });

  it('clamps to 480 months maximum', () => {
    expect(calcNationalPension(600)).toBe(795000);
  });

  it('returns 0 for 0 months', () => {
    expect(calcNationalPension(0)).toBe(0);
  });
});

describe('calcEmployeePension', () => {
  it('calculates based on salary and months', () => {
    const result = calcEmployeePension(300000, 480);
    expect(result).toBe(Math.round(300000 * 0.005481 * 480));
  });
});

describe('calcPension', () => {
  it('calculates total pension correctly', () => {
    const result = calcPension(350000, 480, 420);
    expect(result.totalYearly).toBe(result.nationalPensionYearly + result.employeePensionYearly);
    expect(result.totalMonthly).toBe(Math.round(result.totalYearly / 12));
  });

  it('monthly is yearly divided by 12', () => {
    const result = calcPension(300000, 360, 360);
    expect(result.nationalPensionMonthly).toBe(Math.round(result.nationalPensionYearly / 12));
    expect(result.employeePensionMonthly).toBe(Math.round(result.employeePensionYearly / 12));
  });
});

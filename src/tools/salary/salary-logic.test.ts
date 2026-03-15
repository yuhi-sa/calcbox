import { describe, it, expect } from 'vitest';
import { calculateSalary } from './salary-logic';

describe('salary calculations', () => {
  it('calculates salary for 4M annual income, age 30, 0 dependents', () => {
    const result = calculateSalary(4000000, 30, 0);
    expect(result.annualGross).toBe(4000000);
    expect(result.annualNet).toBeGreaterThan(0);
    expect(result.annualNet).toBeLessThan(4000000);
    expect(result.monthlyNet).toBeCloseTo(result.annualNet / 12, 0);
    expect(result.healthInsurance).toBe(Math.floor(4000000 * 0.05));
    expect(result.pension).toBe(Math.floor(4000000 * 0.0915));
    expect(result.nursingInsurance).toBe(0); // age < 40
  });

  it('includes nursing insurance for age >= 40', () => {
    const result = calculateSalary(4000000, 45, 0);
    expect(result.nursingInsurance).toBeGreaterThan(0);
  });

  it('reduces taxes with dependents', () => {
    const noDeps = calculateSalary(6000000, 35, 0);
    const withDeps = calculateSalary(6000000, 35, 2);
    expect(withDeps.annualNet).toBeGreaterThan(noDeps.annualNet);
  });
});

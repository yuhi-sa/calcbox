import { describe, it, expect } from 'vitest';
import { calculateCycles, formatDate } from './menstrual-cycle-logic';

describe('Menstrual Cycle calculations', () => {
  it('calculates next period date with default 28-day cycle', () => {
    const lastPeriod = new Date(2026, 0, 1); // Jan 1, 2026
    const result = calculateCycles(lastPeriod);
    expect(result.nextCycles[0].periodStart.getTime()).toBe(new Date(2026, 0, 29).getTime());
  });

  it('calculates ovulation date as cycle - 14 days before next period', () => {
    const lastPeriod = new Date(2026, 0, 1);
    const result = calculateCycles(lastPeriod, 28);
    // Next period: Jan 29. Ovulation: Jan 29 - 14 = Jan 15
    expect(result.nextCycles[0].ovulationDate.getTime()).toBe(new Date(2026, 0, 15).getTime());
  });

  it('calculates fertile window as ovulation +/- 2 days', () => {
    const lastPeriod = new Date(2026, 0, 1);
    const result = calculateCycles(lastPeriod, 28);
    // Ovulation: Jan 15. Fertile: Jan 13 - Jan 17
    expect(result.nextCycles[0].fertileWindowStart.getTime()).toBe(new Date(2026, 0, 13).getTime());
    expect(result.nextCycles[0].fertileWindowEnd.getTime()).toBe(new Date(2026, 0, 17).getTime());
  });

  it('returns 3 cycles by default', () => {
    const lastPeriod = new Date(2026, 0, 1);
    const result = calculateCycles(lastPeriod);
    expect(result.nextCycles).toHaveLength(3);
  });

  it('handles custom cycle length of 30 days', () => {
    const lastPeriod = new Date(2026, 0, 1);
    const result = calculateCycles(lastPeriod, 30);
    // Next period: Jan 31
    expect(result.nextCycles[0].periodStart.getTime()).toBe(new Date(2026, 0, 31).getTime());
    // Ovulation: Jan 31 - 14 = Jan 17
    expect(result.nextCycles[0].ovulationDate.getTime()).toBe(new Date(2026, 0, 17).getTime());
  });

  it('formats date correctly', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('2026/01/05');
  });
});

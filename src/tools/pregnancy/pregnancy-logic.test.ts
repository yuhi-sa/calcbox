import { describe, it, expect } from 'vitest';
import { calcDueDate, calcWeeks, getTrimester, calculatePregnancy } from './pregnancy-logic';

describe('Pregnancy calculations', () => {
  it('calculates due date as last period + 280 days', () => {
    const lmp = new Date('2025-01-01');
    const due = calcDueDate(lmp);
    expect(due.toISOString().slice(0, 10)).toBe('2025-10-08');
  });

  it('calculates weeks and days correctly', () => {
    const lmp = new Date('2025-01-01');
    const today = new Date('2025-03-12'); // 70 days later
    const result = calcWeeks(lmp, today);
    expect(result.weeks).toBe(10);
    expect(result.days).toBe(0);
    expect(result.totalDays).toBe(70);
  });

  it('returns correct trimester', () => {
    expect(getTrimester(5)).toBe('初期（第1三半期）');
    expect(getTrimester(20)).toBe('中期（第2三半期）');
    expect(getTrimester(35)).toBe('後期（第3三半期）');
  });

  it('calculatePregnancy returns complete result', () => {
    const lmp = new Date('2025-01-01');
    const today = new Date('2025-04-01'); // 90 days
    const result = calculatePregnancy(lmp, today);
    expect(result.currentWeeks).toBe(12);
    expect(result.currentDays).toBe(6);
    expect(result.trimester).toBe('初期（第1三半期）');
    expect(result.daysRemaining).toBe(190);
  });
});

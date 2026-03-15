import { describe, it, expect } from 'vitest';
import { getBaseHourlyRate, calculateOvertime, RATES } from './overtime-logic';

describe('Overtime calculations', () => {
  it('calculates base hourly rate from hourly input', () => {
    const rate = getBaseHourlyRate({ mode: 'hourly', hourlyRate: 1500, normalHours: 0, lateNightHours: 0, holidayHours: 0, holidayLateNightHours: 0 });
    expect(rate).toBe(1500);
  });

  it('calculates base hourly rate from monthly salary', () => {
    const rate = getBaseHourlyRate({ mode: 'monthly', monthlySalary: 320000, monthlyHours: 160, normalHours: 0, lateNightHours: 0, holidayHours: 0, holidayLateNightHours: 0 });
    expect(rate).toBe(2000);
  });

  it('uses correct Japanese labor law rates', () => {
    expect(RATES.normal).toBe(1.25);
    expect(RATES.lateNight).toBe(1.50);
    expect(RATES.holiday).toBe(1.35);
    expect(RATES.holidayLateNight).toBe(1.60);
  });

  it('calculates normal overtime pay correctly', () => {
    const result = calculateOvertime({
      mode: 'hourly',
      hourlyRate: 2000,
      normalHours: 10,
      lateNightHours: 0,
      holidayHours: 0,
      holidayLateNightHours: 0,
    });
    expect(result.normalOvertimePay).toBe(2000 * 1.25 * 10); // 25000
    expect(result.totalOvertimePay).toBe(25000);
  });

  it('calculates all overtime types', () => {
    const result = calculateOvertime({
      mode: 'hourly',
      hourlyRate: 1000,
      normalHours: 10,
      lateNightHours: 5,
      holidayHours: 8,
      holidayLateNightHours: 3,
    });
    expect(result.normalOvertimePay).toBe(1000 * 1.25 * 10);
    expect(result.lateNightPay).toBe(1000 * 1.50 * 5);
    expect(result.holidayPay).toBe(1000 * 1.35 * 8);
    expect(result.holidayLateNightPay).toBe(1000 * 1.60 * 3);
    expect(result.totalOvertimePay).toBe(12500 + 7500 + 10800 + 4800);
  });

  it('handles monthly salary with all overtime types', () => {
    const result = calculateOvertime({
      mode: 'monthly',
      monthlySalary: 240000,
      monthlyHours: 160,
      normalHours: 20,
      lateNightHours: 0,
      holidayHours: 0,
      holidayLateNightHours: 0,
    });
    // base = 240000/160 = 1500
    expect(result.baseHourlyRate).toBe(1500);
    expect(result.normalOvertimePay).toBe(1500 * 1.25 * 20);
  });
});

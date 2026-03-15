import { describe, it, expect } from 'vitest';
import { calcPartTimePay } from './part-time-pay-logic';

describe('calcPartTimePay', () => {
  it('calculates daily pay correctly', () => {
    const result = calcPartTimePay(1000, 5, 3, 'weekly');
    expect(result.dailyPay).toBe(5000);
  });

  it('calculates yearly pay from weekly shifts', () => {
    const result = calcPartTimePay(1000, 8, 3, 'weekly');
    expect(result.yearlyPay).toBeGreaterThan(0);
    expect(result.monthlyPay).toBeGreaterThan(0);
  });

  it('warns when exceeding 103万 wall', () => {
    // 1200yen * 8h * 5days/week = high income
    const result = calcPartTimePay(1200, 8, 5, 'weekly');
    const wall103 = result.warnings.find((w) => w.wall === '103万円の壁');
    expect(wall103).toBeDefined();
    expect(wall103!.exceeded).toBe(true);
  });

  it('no warnings for low income', () => {
    const result = calcPartTimePay(1000, 4, 2, 'weekly');
    const exceededWarnings = result.warnings.filter((w) => w.exceeded);
    expect(exceededWarnings).toHaveLength(0);
  });

  it('handles monthly shift basis', () => {
    const result = calcPartTimePay(1100, 6, 15, 'monthly');
    expect(result.dailyPay).toBe(6600);
    expect(result.monthlyPay).toBe(Math.round(6600 * 15));
    expect(result.yearlyPay).toBe(Math.round(6600 * 15) * 12);
  });
});

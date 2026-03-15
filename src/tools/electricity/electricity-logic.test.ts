import { describe, it, expect } from 'vitest';
import { calcElectricity, DEFAULT_UNIT_PRICE } from './electricity-logic';

describe('electricity calculations', () => {
  it('calculates daily kWh correctly', () => {
    const result = calcElectricity(1000, 10);
    expect(result.dailyKwh).toBeCloseTo(10);
  });

  it('calculates monthly kWh as daily × 30', () => {
    const result = calcElectricity(1000, 10);
    expect(result.monthlyKwh).toBeCloseTo(300);
  });

  it('calculates yearly kWh as monthly × 12', () => {
    const result = calcElectricity(1000, 10);
    expect(result.yearlyKwh).toBeCloseTo(3600);
  });

  it('calculates cost using default unit price', () => {
    const result = calcElectricity(1000, 1);
    expect(result.dailyCost).toBeCloseTo(1 * DEFAULT_UNIT_PRICE);
    expect(result.monthlyCost).toBeCloseTo(30 * DEFAULT_UNIT_PRICE);
    expect(result.yearlyCost).toBeCloseTo(360 * DEFAULT_UNIT_PRICE);
  });

  it('calculates cost using custom unit price', () => {
    const result = calcElectricity(500, 8, 25);
    expect(result.dailyKwh).toBeCloseTo(4);
    expect(result.dailyCost).toBeCloseTo(100);
  });

  it('throws for negative wattage', () => {
    expect(() => calcElectricity(-100, 8)).toThrow();
  });

  it('handles zero wattage', () => {
    const result = calcElectricity(0, 24);
    expect(result.dailyKwh).toBe(0);
    expect(result.dailyCost).toBe(0);
  });
});

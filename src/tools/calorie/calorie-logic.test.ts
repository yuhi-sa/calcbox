import { describe, it, expect } from 'vitest';
import { calcCalories, calculateCalorie, ACTIVITIES } from './calorie-logic';

describe('Calorie calculations', () => {
  it('calculates calories for walking', () => {
    // 3.5 * 60 * 0.5 * 1.05 = 110.25
    expect(calcCalories(3.5, 60, 30)).toBeCloseTo(110.25, 1);
  });

  it('calculates calories for running 1 hour', () => {
    // 10.0 * 70 * 1.0 * 1.05 = 735
    expect(calcCalories(10.0, 70, 60)).toBeCloseTo(735, 0);
  });

  it('has correct number of preset activities', () => {
    expect(ACTIVITIES).toHaveLength(8);
  });

  it('calculateCalorie returns complete result', () => {
    const result = calculateCalorie(0, 60, 30); // walking
    expect(result.activity).toBe('ウォーキング');
    expect(result.met).toBe(3.5);
    expect(result.calories).toBeCloseTo(110.25, 1);
    expect(result.durationMinutes).toBe(30);
  });

  it('calculates zero duration as zero calories', () => {
    expect(calcCalories(7.0, 65, 0)).toBe(0);
  });
});

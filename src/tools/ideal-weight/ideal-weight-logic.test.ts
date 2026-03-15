import { describe, it, expect } from 'vitest';
import { calcIdealWeight, calcDailyCalorieDeficit, calculateIdealWeight } from './ideal-weight-logic';

describe('Ideal Weight calculations', () => {
  it('calculates standard weight (BMI 22)', () => {
    // (1.70)^2 * 22 = 2.89 * 22 = 63.58
    expect(calcIdealWeight(170, 22)).toBeCloseTo(63.58, 1);
  });

  it('calculates beauty weight (BMI 20)', () => {
    expect(calcIdealWeight(170, 20)).toBeCloseTo(57.8, 1);
  });

  it('calculates model weight (BMI 18)', () => {
    expect(calcIdealWeight(170, 18)).toBeCloseTo(52.02, 1);
  });

  it('calculates daily calorie deficit', () => {
    // 5kg * 7200 = 36000 kcal / (3 months * 30 days) = 400 kcal/day
    expect(calcDailyCalorieDeficit(5, 3)).toBeCloseTo(400, 0);
  });

  it('returns null for non-positive weight diff', () => {
    expect(calcDailyCalorieDeficit(-2, 3)).toBeNull();
    expect(calcDailyCalorieDeficit(0, 3)).toBeNull();
  });

  it('calculateIdealWeight returns 3 targets', () => {
    const result = calculateIdealWeight(170, 70, 3);
    expect(result.targets).toHaveLength(3);
    expect(result.targets[0].label).toBe('標準体重（BMI 22）');
    expect(result.targets[0].weight).toBeCloseTo(63.58, 1);
    expect(result.targets[0].diff).toBeCloseTo(6.42, 1);
    expect(result.targets[0].dailyCalorieDeficit).toBeCloseTo(513.6, 0);
  });
});

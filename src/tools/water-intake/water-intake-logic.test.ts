import { describe, it, expect } from 'vitest';
import { calculateWaterIntake } from './water-intake-logic';

describe('Water Intake calculations', () => {
  it('calculates base intake for sedentary person in temperate climate', () => {
    const result = calculateWaterIntake({ weightKg: 60, activityLevel: 'sedentary', climate: 'temperate' });
    // 60 * 35 * 1.0 * 1.0 = 2100
    expect(result.dailyMl).toBe(2100);
    expect(result.dailyCups).toBe(10.5);
  });

  it('increases intake for active person', () => {
    const result = calculateWaterIntake({ weightKg: 70, activityLevel: 'active', climate: 'temperate' });
    // 70 * 35 * 1.4 * 1.0 = 3430
    expect(result.dailyMl).toBe(3430);
  });

  it('increases intake in hot climate', () => {
    const result = calculateWaterIntake({ weightKg: 60, activityLevel: 'sedentary', climate: 'hot' });
    // 60 * 35 * 1.0 * 1.3 = 2730
    expect(result.dailyMl).toBe(2730);
  });

  it('decreases intake in cool climate', () => {
    const result = calculateWaterIntake({ weightKg: 60, activityLevel: 'sedentary', climate: 'cool' });
    // 60 * 35 * 1.0 * 0.9 = 1890
    expect(result.dailyMl).toBe(1890);
  });

  it('combines activity and climate multipliers', () => {
    const result = calculateWaterIntake({ weightKg: 80, activityLevel: 'very_active', climate: 'hot' });
    // 80 * 35 * 1.6 * 1.3 = 5824
    expect(result.dailyMl).toBe(5824);
  });

  it('returns correct cups (200mL per cup)', () => {
    const result = calculateWaterIntake({ weightKg: 60, activityLevel: 'sedentary', climate: 'temperate' });
    expect(result.dailyCups).toBeCloseTo(result.dailyMl / 200, 1);
  });
});

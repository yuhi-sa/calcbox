import { describe, it, expect } from 'vitest';
import { calculateMovingCost } from './moving-cost-logic';

describe('Moving Cost Estimator', () => {
  it('calculates base cost for 1人 within 20km in 通常期', () => {
    const result = calculateMovingCost(10, '1人', '通常期');
    expect(result.baseCost).toBe(30000);
    expect(result.distanceSurcharge).toBe(0);
    expect(result.seasonMultiplier).toBe(1.0);
    expect(result.totalCost).toBe(30000);
  });

  it('adds distance surcharge over 20km', () => {
    const result = calculateMovingCost(50, '2人', '通常期');
    expect(result.baseCost).toBe(60000);
    expect(result.distanceSurcharge).toBe(15000); // (50-20)*500
    expect(result.totalCost).toBe(75000);
  });

  it('applies 繁忙期 multiplier of 1.5x', () => {
    const result = calculateMovingCost(10, '3人', '繁忙期');
    expect(result.baseCost).toBe(80000);
    expect(result.seasonMultiplier).toBe(1.5);
    expect(result.totalCost).toBe(120000);
  });

  it('combines distance surcharge and 繁忙期 multiplier', () => {
    const result = calculateMovingCost(100, '4人+', '繁忙期');
    expect(result.baseCost).toBe(100000);
    expect(result.distanceSurcharge).toBe(40000); // (100-20)*500
    expect(result.seasonMultiplier).toBe(1.5);
    expect(result.totalCost).toBe(210000); // (100000+40000)*1.5
  });

  it('handles exactly 20km with no surcharge', () => {
    const result = calculateMovingCost(20, '1人', '通常期');
    expect(result.distanceSurcharge).toBe(0);
    expect(result.totalCost).toBe(30000);
  });
});

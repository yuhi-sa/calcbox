import { describe, it, expect } from 'vitest';
import { calcPureAlcohol, calcDecompositionRate, calcDecompositionTime, calculateAlcohol } from './alcohol-logic';

describe('Alcohol calculations', () => {
  it('calculates pure alcohol grams', () => {
    // 500ml beer at 5%: 500 * 0.05 * 0.8 = 20g
    expect(calcPureAlcohol(500, 5)).toBeCloseTo(20, 1);
  });

  it('calculates decomposition rate', () => {
    // 60kg person: 60 * 0.1 = 6 g/hour
    expect(calcDecompositionRate(60)).toBeCloseTo(6, 1);
  });

  it('calculates decomposition time', () => {
    // 20g alcohol / 6 g/hour = 3.33 hours
    expect(calcDecompositionTime(20, 6)).toBeCloseTo(3.33, 1);
  });

  it('calculateAlcohol returns complete result', () => {
    const now = new Date('2025-01-01T20:00:00');
    const result = calculateAlcohol(500, 5, 60, now);
    expect(result.pureAlcoholGrams).toBeCloseTo(20, 1);
    expect(result.decompositionRatePerHour).toBeCloseTo(6, 1);
    expect(result.decompositionTimeHours).toBeCloseTo(3.33, 1);
    // sober at roughly 23:20
    expect(result.soberTime.getHours()).toBe(23);
  });

  it('handles zero volume', () => {
    const now = new Date('2025-01-01T20:00:00');
    const result = calculateAlcohol(0, 5, 60, now);
    expect(result.pureAlcoholGrams).toBe(0);
    expect(result.decompositionTimeHours).toBe(0);
  });
});

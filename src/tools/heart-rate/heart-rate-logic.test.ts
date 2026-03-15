import { describe, it, expect } from 'vitest';
import { calculateMaxHeartRate, calculateHeartRateZones } from './heart-rate-logic';

describe('Heart Rate Zone calculations', () => {
  it('calculates max heart rate correctly', () => {
    expect(calculateMaxHeartRate(30)).toBe(190);
    expect(calculateMaxHeartRate(40)).toBe(180);
    expect(calculateMaxHeartRate(20)).toBe(200);
  });

  it('returns 5 training zones', () => {
    const result = calculateHeartRateZones({ age: 30 });
    expect(result.zones).toHaveLength(5);
  });

  it('uses standard method when no resting heart rate', () => {
    const result = calculateHeartRateZones({ age: 30 });
    expect(result.method).toBe('standard');
    expect(result.maxHeartRate).toBe(190);
    // Zone 1 (Recovery): 50-60% of 190 = 95-114
    expect(result.zones[0].minBpm).toBe(95);
    expect(result.zones[0].maxBpm).toBe(114);
  });

  it('uses Karvonen method when resting heart rate is provided', () => {
    const result = calculateHeartRateZones({ age: 30, restingHeartRate: 60 });
    expect(result.method).toBe('karvonen');
    // HRR = 190 - 60 = 130
    // Zone 1: 130 * 0.5 + 60 = 125, 130 * 0.6 + 60 = 138
    expect(result.zones[0].minBpm).toBe(125);
    expect(result.zones[0].maxBpm).toBe(138);
  });

  it('zone names are correct', () => {
    const result = calculateHeartRateZones({ age: 25 });
    expect(result.zones[0].name).toBe('Recovery');
    expect(result.zones[1].name).toBe('Fat Burn');
    expect(result.zones[2].name).toBe('Cardio');
    expect(result.zones[3].name).toBe('Threshold');
    expect(result.zones[4].name).toBe('VO2max');
  });
});

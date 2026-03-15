import { describe, it, expect } from 'vitest';
import { calculateWbgt, getDangerLevel, getRecommendation, estimateWbgt } from './wbgt-logic';

describe('WBGT Calculator', () => {
  it('returns ほぼ安全 for cool conditions', () => {
    const result = calculateWbgt({ temperature: 18, humidity: 40 });
    expect(result.dangerLevel).toBe('ほぼ安全');
  });

  it('returns 危険 for extreme heat and humidity', () => {
    const result = calculateWbgt({ temperature: 38, humidity: 85 });
    expect(result.dangerLevel).toBe('危険');
    expect(result.wbgt).toBeGreaterThanOrEqual(31);
  });

  it('getDangerLevel returns correct levels at boundaries', () => {
    expect(getDangerLevel(20)).toBe('ほぼ安全');
    expect(getDangerLevel(21)).toBe('注意');
    expect(getDangerLevel(25)).toBe('警戒');
    expect(getDangerLevel(28)).toBe('厳重警戒');
    expect(getDangerLevel(31)).toBe('危険');
  });

  it('getRecommendation returns non-empty string for all levels', () => {
    const levels = ['ほぼ安全', '注意', '警戒', '厳重警戒', '危険'] as const;
    for (const level of levels) {
      expect(getRecommendation(level).length).toBeGreaterThan(0);
    }
  });

  it('WBGT increases with temperature', () => {
    const low = estimateWbgt(20, 50);
    const high = estimateWbgt(35, 50);
    expect(high).toBeGreaterThan(low);
  });

  it('WBGT increases with humidity', () => {
    const low = estimateWbgt(30, 30);
    const high = estimateWbgt(30, 90);
    expect(high).toBeGreaterThan(low);
  });
});

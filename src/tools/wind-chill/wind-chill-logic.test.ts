import { describe, it, expect } from 'vitest';
import { calculateWindChill, calcWindChill, toKmh, getDangerLevel, getFrostbiteRisk } from './wind-chill-logic';

describe('Wind Chill Calculator', () => {
  it('converts m/s to km/h correctly', () => {
    expect(toKmh(10, 'm/s')).toBeCloseTo(36, 0);
    expect(toKmh(36, 'km/h')).toBe(36);
  });

  it('calculates wind chill for known values', () => {
    // At -10°C and 30 km/h wind
    const wc = calcWindChill(-10, 30);
    // Expected approximately -20°C
    expect(wc).toBeLessThan(-15);
    expect(wc).toBeGreaterThan(-25);
  });

  it('returns invalid for temperature above 10°C', () => {
    const result = calculateWindChill({ temperature: 15, windSpeed: 20, windSpeedUnit: 'km/h' });
    expect(result.isValid).toBe(false);
  });

  it('returns invalid for wind speed too low', () => {
    const result = calculateWindChill({ temperature: 5, windSpeed: 1, windSpeedUnit: 'm/s' });
    // 1 m/s = 3.6 km/h < 4.8 km/h
    expect(result.isValid).toBe(false);
  });

  it('returns valid result for cold and windy conditions', () => {
    const result = calculateWindChill({ temperature: -5, windSpeed: 10, windSpeedUnit: 'm/s' });
    expect(result.isValid).toBe(true);
    expect(result.windChill).toBeLessThan(-5);
  });

  it('getDangerLevel returns correct levels', () => {
    expect(getDangerLevel(5)).toBe('注意');
    expect(getDangerLevel(-5)).toBe('警戒');
    expect(getDangerLevel(-15)).toBe('厳重警戒');
    expect(getDangerLevel(-30)).toBe('危険');
    expect(getDangerLevel(15)).toBe('安全');
  });

  it('frostbite risk message changes with severity', () => {
    const mild = getFrostbiteRisk(5);
    const severe = getFrostbiteRisk(-30);
    expect(mild).not.toBe(severe);
    expect(severe).toContain('凍傷');
  });
});

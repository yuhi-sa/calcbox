import { describe, it, expect } from 'vitest';
import { calcSpeed, calcDistance, calcTime, speedToPace, formatTime, calcMarathonTime, calculate } from './speed-logic';

describe('speed calculations', () => {
  it('calculates speed from distance and time', () => {
    expect(calcSpeed(100, 2)).toBe(50);
  });

  it('calculates distance from speed and time', () => {
    expect(calcDistance(60, 2)).toBe(120);
  });

  it('calculates time from distance and speed', () => {
    expect(calcTime(100, 50)).toBe(2);
  });

  it('converts speed to pace', () => {
    expect(speedToPace(12)).toBeCloseTo(5); // 5 min/km
  });

  it('formats time correctly', () => {
    expect(formatTime(1.5)).toBe('1時間30分00秒');
    expect(formatTime(2)).toBe('2時間00分00秒');
  });

  it('calculates marathon time', () => {
    // At 10 km/h, marathon = 42.195 / 10 = 4.2195 hours
    const time = calcMarathonTime(10);
    expect(time).toContain('4時間');
  });

  it('calculate in speed mode', () => {
    const result = calculate('speed', { distance: 100, time: 2 });
    expect(result.speed).toBe(50);
    expect(result.distance).toBe(100);
    expect(result.time).toBe(2);
  });

  it('calculate in distance mode', () => {
    const result = calculate('distance', { speed: 60, time: 2 });
    expect(result.distance).toBe(120);
  });

  it('calculate in time mode', () => {
    const result = calculate('time', { distance: 100, speed: 50 });
    expect(result.time).toBe(2);
  });

  it('throws for zero time', () => {
    expect(() => calcSpeed(100, 0)).toThrow();
  });
});

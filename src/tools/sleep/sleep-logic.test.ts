import { describe, it, expect } from 'vitest';
import { calcBedtimes, calcWakeTimes, formatTime, calculateSleep } from './sleep-logic';

describe('Sleep calculations', () => {
  it('calculates bedtimes from wake-up time', () => {
    const wake = new Date('2025-01-01T07:00:00');
    const bedtimes = calcBedtimes(wake);
    expect(bedtimes).toHaveLength(3);
    // 6 cycles: 9h + 15min = 9h15min before 7:00 = 21:45
    expect(formatTime(bedtimes[0].time)).toBe('21:45');
    expect(bedtimes[0].cycles).toBe(6);
    // 5 cycles: 7.5h + 15min = 7h45min before 7:00 = 23:15
    expect(formatTime(bedtimes[1].time)).toBe('23:15');
    expect(bedtimes[1].cycles).toBe(5);
    // 4 cycles: 6h + 15min = 6h15min before 7:00 = 00:45
    expect(formatTime(bedtimes[2].time)).toBe('00:45');
    expect(bedtimes[2].cycles).toBe(4);
  });

  it('calculates wake times from bedtime', () => {
    const bed = new Date('2025-01-01T23:00:00');
    const wakeTimes = calcWakeTimes(bed);
    expect(wakeTimes).toHaveLength(3);
    // 4 cycles: 6h + 15min = 05:15
    expect(formatTime(wakeTimes[0].time)).toBe('05:15');
    expect(wakeTimes[0].cycles).toBe(4);
    // 5 cycles: 7.5h + 15min = 06:45
    expect(formatTime(wakeTimes[1].time)).toBe('06:45');
    // 6 cycles: 9h + 15min = 08:15
    expect(formatTime(wakeTimes[2].time)).toBe('08:15');
  });

  it('formats time correctly', () => {
    expect(formatTime(new Date('2025-01-01T09:05:00'))).toBe('09:05');
    expect(formatTime(new Date('2025-01-01T23:30:00'))).toBe('23:30');
  });

  it('calculateSleep returns correct mode', () => {
    const result = calculateSleep('wake', new Date('2025-01-01T07:00:00'));
    expect(result.mode).toBe('wake');
    expect(result.times).toHaveLength(3);
  });
});

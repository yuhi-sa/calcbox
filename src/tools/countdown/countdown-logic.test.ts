import { describe, it, expect } from 'vitest';
import { calculateCountdown, formatCountdown } from './countdown-logic';

describe('Countdown calculations', () => {
  it('calculates remaining time correctly', () => {
    const now = new Date('2025-01-01T00:00:00');
    const target = new Date('2025-01-02T12:30:45');
    const result = calculateCountdown(now, target);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(12);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
    expect(result.isExpired).toBe(false);
  });

  it('returns expired when target is in the past', () => {
    const now = new Date('2025-06-01T00:00:00');
    const target = new Date('2025-01-01T00:00:00');
    const result = calculateCountdown(now, target);
    expect(result.isExpired).toBe(true);
    expect(result.days).toBe(0);
  });

  it('formats countdown with days', () => {
    const result = { days: 3, hours: 5, minutes: 10, seconds: 30, totalSeconds: 277830, isExpired: false };
    expect(formatCountdown(result)).toBe('3日 05:10:30');
  });

  it('formats countdown without days', () => {
    const result = { days: 0, hours: 1, minutes: 5, seconds: 3, totalSeconds: 3903, isExpired: false };
    expect(formatCountdown(result)).toBe('01:05:03');
  });

  it('formats expired countdown', () => {
    const result = { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
    expect(formatCountdown(result)).toBe('終了');
  });
});

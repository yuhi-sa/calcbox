import { describe, it, expect } from 'vitest';
import { formatDate, timestampToDate, dateToTimestamp, getCurrentTimestamp } from './timestamp-logic';

describe('timestamp conversion', () => {
  it('converts timestamp to date', () => {
    const date = timestampToDate(1700000000, 's');
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2023);
  });

  it('converts millisecond timestamp to date', () => {
    const date = timestampToDate(1700000000000, 'ms');
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2023);
  });

  it('returns null for invalid timestamp', () => {
    const date = timestampToDate(NaN, 's');
    expect(date).toBeNull();
  });

  it('converts date to timestamp', () => {
    const date = new Date(2023, 10, 14, 22, 13, 20); // Nov 14 2023
    const result = dateToTimestamp(date);
    expect(result.seconds).toBeGreaterThan(0);
    expect(result.milliseconds).toBe(result.seconds * 1000);
  });

  it('formats date correctly', () => {
    const date = new Date(2023, 0, 5, 9, 3, 7);
    expect(formatDate(date)).toBe('2023-01-05 09:03:07');
  });

  it('getCurrentTimestamp returns current time', () => {
    const ts = getCurrentTimestamp();
    const now = Math.floor(Date.now() / 1000);
    expect(Math.abs(ts - now)).toBeLessThanOrEqual(1);
  });
});

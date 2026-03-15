import { describe, it, expect } from 'vitest';
import { parseDate, formatDate, getRelativeTime } from './date-format-logic';

describe('Date format conversions', () => {
  it('parses valid date strings', () => {
    const d = parseDate('2024-01-15');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2024);
    expect(d!.getMonth()).toBe(0); // January
    expect(d!.getDate()).toBe(15);
  });

  it('returns null for invalid date strings', () => {
    expect(parseDate('not-a-date')).toBeNull();
    expect(parseDate('')).toBeNull();
  });

  it('formats date in YYYY-MM-DD', () => {
    const d = new Date(2024, 0, 15); // Jan 15, 2024
    const result = formatDate(d);
    expect(result.yyyymmdd).toBe('2024-01-15');
  });

  it('formats date in DD/MM/YYYY', () => {
    const d = new Date(2024, 11, 5); // Dec 5, 2024
    const result = formatDate(d);
    expect(result.ddmmyyyy).toBe('05/12/2024');
  });

  it('formats date in Japanese', () => {
    const d = new Date(2024, 2, 3); // Mar 3, 2024
    const result = formatDate(d);
    expect(result.japanese).toBe('2024年3月3日');
  });

  it('calculates unix timestamp', () => {
    const d = new Date(2024, 0, 1, 0, 0, 0);
    const result = formatDate(d);
    expect(result.unixTimestamp).toBe(Math.floor(d.getTime() / 1000));
  });

  it('gets relative time', () => {
    const today = new Date();
    expect(getRelativeTime(today)).toBe('今日');

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getRelativeTime(yesterday)).toBe('昨日');

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(getRelativeTime(tomorrow)).toBe('明日');
  });
});

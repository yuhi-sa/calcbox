import { describe, it, expect } from 'vitest';
import { convertTimezone, TIMEZONES } from './timezone-logic';

describe('Timezone conversion', () => {
  it('converts JST to UTC (-9 hours)', () => {
    const result = convertTimezone(21, 0, 'JST', 'UTC');
    expect(result).not.toBeNull();
    expect(result!.hours).toBe(12);
    expect(result!.minutes).toBe(0);
    expect(result!.dateChange).toBe(0);
  });

  it('converts UTC to JST (+9 hours)', () => {
    const result = convertTimezone(18, 0, 'UTC', 'JST');
    expect(result).not.toBeNull();
    expect(result!.hours).toBe(3);
    expect(result!.minutes).toBe(0);
    expect(result!.dateChange).toBe(1);
    expect(result!.dateChangeLabel).toBe('翌日');
  });

  it('handles date change backward', () => {
    const result = convertTimezone(2, 0, 'JST', 'UTC');
    expect(result).not.toBeNull();
    expect(result!.hours).toBe(17);
    expect(result!.dateChange).toBe(-1);
    expect(result!.dateChangeLabel).toBe('前日');
  });

  it('handles IST half-hour offset', () => {
    const result = convertTimezone(12, 0, 'UTC', 'IST');
    expect(result).not.toBeNull();
    expect(result!.hours).toBe(17);
    expect(result!.minutes).toBe(30);
  });

  it('returns null for unknown timezone', () => {
    expect(convertTimezone(12, 0, 'FAKE', 'UTC')).toBeNull();
  });

  it('has correct number of timezone presets', () => {
    expect(TIMEZONES.length).toBe(10);
  });
});

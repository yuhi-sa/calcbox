import { describe, it, expect } from 'vitest';
import { parseTime, addTimes, subtractTimes, timeDifference, minutesToHours, hoursToMinutes } from './time-logic';

describe('Time calculations', () => {
  it('parses time strings correctly', () => {
    expect(parseTime('2:30')).toEqual({ hours: 2, minutes: 30 });
    expect(parseTime('10:05')).toEqual({ hours: 10, minutes: 5 });
    expect(parseTime('invalid')).toBeNull();
    expect(parseTime('1:60')).toBeNull();
  });

  it('adds two times', () => {
    const result = addTimes({ hours: 1, minutes: 30 }, { hours: 2, minutes: 45 });
    expect(result.hours).toBe(4);
    expect(result.minutes).toBe(15);
    expect(result.formatted).toBe('4:15');
  });

  it('subtracts times', () => {
    const result = subtractTimes({ hours: 3, minutes: 0 }, { hours: 1, minutes: 30 });
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(30);
    expect(result.formatted).toBe('1:30');
  });

  it('calculates time difference', () => {
    const result = timeDifference({ hours: 9, minutes: 0 }, { hours: 17, minutes: 30 });
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(30);
  });

  it('converts minutes to hours', () => {
    const result = minutesToHours(150);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(30);
  });

  it('converts hours to minutes', () => {
    expect(hoursToMinutes(2, 30)).toBe(150);
  });
});

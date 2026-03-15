import { describe, it, expect } from 'vitest';
import { calculateAge, calcDaysUntilNextBirthday } from './age-logic';

describe('Age calculations', () => {
  it('calculates age correctly for a simple case', () => {
    const birthday = new Date(2000, 0, 1); // 2000-01-01
    const ref = new Date(2025, 0, 1); // 2025-01-01
    const result = calculateAge(birthday, ref);
    expect(result.years).toBe(25);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('calculates partial years/months/days', () => {
    const birthday = new Date(1990, 5, 15); // 1990-06-15
    const ref = new Date(2025, 2, 10); // 2025-03-10
    const result = calculateAge(birthday, ref);
    expect(result.years).toBe(34);
    expect(result.months).toBe(8);
    expect(result.days).toBe(23);
  });

  it('calculates total days lived', () => {
    const birthday = new Date(2024, 0, 1);
    const ref = new Date(2024, 0, 11);
    const result = calculateAge(birthday, ref);
    expect(result.totalDays).toBe(10);
  });

  it('calculates days until next birthday', () => {
    const birthday = new Date(2000, 11, 25); // Dec 25
    const ref = new Date(2025, 11, 20); // Dec 20
    const days = calcDaysUntilNextBirthday(birthday, ref);
    expect(days).toBe(5);
  });

  it('returns 365/366 when birthday just passed', () => {
    const birthday = new Date(2000, 0, 1); // Jan 1
    const ref = new Date(2025, 0, 2); // Jan 2 (birthday was yesterday)
    const days = calcDaysUntilNextBirthday(birthday, ref);
    expect(days).toBe(364); // next Jan 1 is 364 days away
  });
});

import { describe, it, expect } from 'vitest';
import { calcHumanAge, calculatePetAge } from './pet-age-logic';

describe('Pet Age calculations', () => {
  it('calculates dog(small) age correctly', () => {
    expect(calcHumanAge('dog-small', 1)).toBe(15);
    expect(calcHumanAge('dog-small', 2)).toBe(24);
    expect(calcHumanAge('dog-small', 5)).toBe(36); // 24 + 3*4
  });

  it('calculates dog(large) age correctly', () => {
    expect(calcHumanAge('dog-large', 1)).toBe(12);
    expect(calcHumanAge('dog-large', 2)).toBe(22);
    expect(calcHumanAge('dog-large', 5)).toBe(40); // 22 + 3*6
  });

  it('calculates cat age correctly', () => {
    expect(calcHumanAge('cat', 1)).toBe(15);
    expect(calcHumanAge('cat', 2)).toBe(24);
    expect(calcHumanAge('cat', 10)).toBe(56); // 24 + 8*4
  });

  it('handles zero and fractional ages', () => {
    expect(calcHumanAge('cat', 0)).toBe(0);
    expect(calcHumanAge('dog-small', 0.5)).toBeCloseTo(7.5);
  });

  it('calculatePetAge returns complete result', () => {
    const result = calculatePetAge('cat', 3);
    expect(result.humanAge).toBe(28);
    expect(result.petType).toBe('cat');
    expect(result.petAge).toBe(3);
  });
});

import { describe, it, expect } from 'vitest';
import { percentOf, whatPercentOf, percentChange, increaseByPercent, decreaseByPercent } from './percentage-logic';

describe('Percentage calculations', () => {
  it('calculates X% of Y correctly', () => {
    expect(percentOf(20, 150)).toBe(30);
    expect(percentOf(50, 200)).toBe(100);
    expect(percentOf(0, 100)).toBe(0);
  });

  it('calculates what percent X is of Y', () => {
    expect(whatPercentOf(25, 100)).toBe(25);
    expect(whatPercentOf(1, 4)).toBe(25);
    expect(whatPercentOf(0, 100)).toBe(0);
    expect(whatPercentOf(10, 0)).toBeNull();
  });

  it('calculates percentage change from X to Y', () => {
    expect(percentChange(100, 150)).toBe(50);
    expect(percentChange(200, 100)).toBe(-50);
    expect(percentChange(0, 100)).toBeNull();
  });

  it('calculates increase by percent', () => {
    expect(increaseByPercent(100, 10)).toBeCloseTo(110);
    expect(increaseByPercent(200, 50)).toBe(300);
  });

  it('calculates decrease by percent', () => {
    expect(decreaseByPercent(100, 10)).toBe(90);
    expect(decreaseByPercent(200, 25)).toBe(150);
  });
});

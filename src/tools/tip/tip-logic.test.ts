import { describe, it, expect } from 'vitest';
import { calculateTip } from './tip-logic';

describe('Tip calculations', () => {
  it('calculates tip for a single person', () => {
    const result = calculateTip(100, 15, 1);
    expect(result.tipAmount).toBe(15);
    expect(result.total).toBe(115);
    expect(result.perPerson).toBe(115);
    expect(result.tipPerPerson).toBe(15);
  });

  it('splits bill among multiple people', () => {
    const result = calculateTip(100, 20, 4);
    expect(result.tipAmount).toBe(20);
    expect(result.total).toBe(120);
    expect(result.perPerson).toBe(30);
    expect(result.tipPerPerson).toBe(5);
  });

  it('handles zero tip', () => {
    const result = calculateTip(50, 0, 2);
    expect(result.tipAmount).toBe(0);
    expect(result.total).toBe(50);
    expect(result.perPerson).toBe(25);
  });

  it('treats numPeople less than 1 as 1', () => {
    const result = calculateTip(100, 10, 0);
    expect(result.perPerson).toBe(110);
  });

  it('handles large bill amounts', () => {
    const result = calculateTip(1000, 18, 5);
    expect(result.tipAmount).toBe(180);
    expect(result.total).toBe(1180);
    expect(result.perPerson).toBeCloseTo(236, 0);
  });
});

import { describe, it, expect } from 'vitest';
import { getCompatibility, getPersonality, PERSONALITIES } from './blood-type-logic';

describe('Blood Type Compatibility', () => {
  it('returns highest compatibility for A and O', () => {
    const result = getCompatibility('A', 'O');
    expect(result.score).toBe(90);
  });

  it('returns same result regardless of order', () => {
    const r1 = getCompatibility('A', 'B');
    const r2 = getCompatibility('B', 'A');
    expect(r1.score).toBe(r2.score);
    expect(r1.comment).toBe(r2.comment);
  });

  it('returns personality traits for each blood type', () => {
    const personality = getPersonality('A');
    expect(personality.traits).toContain('几帳面');
    expect(personality.description).toBeTruthy();
  });

  it('has personality data for all 4 blood types', () => {
    expect(Object.keys(PERSONALITIES)).toHaveLength(4);
    expect(PERSONALITIES['A']).toBeDefined();
    expect(PERSONALITIES['B']).toBeDefined();
    expect(PERSONALITIES['O']).toBeDefined();
    expect(PERSONALITIES['AB']).toBeDefined();
  });

  it('returns valid compatibility for same type', () => {
    const result = getCompatibility('B', 'B');
    expect(result.score).toBeGreaterThan(0);
    expect(result.advice).toBeTruthy();
  });
});

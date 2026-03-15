import { describe, it, expect } from 'vitest';
import { calcPointReward, comparePointRewards } from './point-reward-logic';

describe('calcPointReward', () => {
  it('calculates points for standard 1% rate', () => {
    const result = calcPointReward(10000, 1);
    expect(result.pointsEarned).toBe(100);
    expect(result.effectiveDiscount).toBe(100);
    expect(result.effectivePrice).toBe(9900);
  });

  it('floors fractional points', () => {
    const result = calcPointReward(999, 1);
    expect(result.pointsEarned).toBe(9); // floor(9.99)
  });

  it('uses custom point value', () => {
    const result = calcPointReward(10000, 1, 5);
    expect(result.pointsEarned).toBe(100);
    expect(result.effectiveDiscount).toBe(500);
    expect(result.effectivePrice).toBe(9500);
  });

  it('handles 0% rate', () => {
    const result = calcPointReward(10000, 0);
    expect(result.pointsEarned).toBe(0);
    expect(result.effectiveDiscount).toBe(0);
    expect(result.effectivePrice).toBe(10000);
  });
});

describe('comparePointRewards', () => {
  it('compares multiple reward programs', () => {
    const results = comparePointRewards(10000, [
      { name: 'Card A', rewardRate: 1, pointValue: 1 },
      { name: 'Card B', rewardRate: 2, pointValue: 1 },
    ]);
    expect(results).toHaveLength(2);
    expect(results[1].result.pointsEarned).toBeGreaterThan(results[0].result.pointsEarned);
  });
});

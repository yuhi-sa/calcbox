import { describe, it, expect } from 'vitest';
import { calcBMR, calcTDEE, calculateBmr } from './bmr-logic';

describe('BMR calculations', () => {
  it('calculates BMR for male', () => {
    // 88.362 + 13.397*70 + 4.799*175 - 5.677*30
    // 88.362 + 937.79 + 839.825 - 170.31 = 1695.667
    expect(calcBMR('male', 30, 175, 70)).toBeCloseTo(1695.67, 0);
  });

  it('calculates BMR for female', () => {
    // 447.593 + 9.247*55 + 3.098*160 - 4.330*25
    // 447.593 + 508.585 + 495.68 - 108.25 = 1343.608
    expect(calcBMR('female', 25, 160, 55)).toBeCloseTo(1343.61, 0);
  });

  it('calculates TDEE correctly', () => {
    const bmr = 1700;
    expect(calcTDEE(bmr, 'sedentary')).toBeCloseTo(2040, 0);
    expect(calcTDEE(bmr, 'moderate')).toBeCloseTo(2635, 0);
    expect(calcTDEE(bmr, 'very_active')).toBeCloseTo(3230, 0);
  });

  it('calculateBmr returns complete result', () => {
    const result = calculateBmr('male', 30, 175, 70, 'moderate');
    expect(result.bmr).toBeCloseTo(1695.67, 0);
    expect(result.tdee).toBeCloseTo(2628.29, 0);
    expect(result.activityLevel).toBe('適度な運動（週3〜5日）');
  });
});

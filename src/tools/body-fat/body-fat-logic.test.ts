import { describe, it, expect } from 'vitest';
import { calcBMI, calcBodyFat, getCategory, calculateBodyFat } from './body-fat-logic';

describe('Body Fat calculations', () => {
  it('calculates BMI correctly', () => {
    expect(calcBMI(170, 65)).toBeCloseTo(22.49, 1);
  });

  it('calculates body fat for male', () => {
    const bmi = calcBMI(170, 65);
    const bf = calcBodyFat(bmi, 30, 'male');
    // 1.2 * 22.49 + 0.23 * 30 - 10.8 * 1 - 5.4
    expect(bf).toBeCloseTo(17.79, 0);
  });

  it('calculates body fat for female', () => {
    const bmi = calcBMI(160, 55);
    const bf = calcBodyFat(bmi, 25, 'female');
    // 1.2 * 21.48 + 0.23 * 25 - 10.8 * 0 - 5.4
    expect(bf).toBeCloseTo(26.13, 0);
  });

  it('categorizes male body fat correctly', () => {
    expect(getCategory(8, 'male').label).toBe('低い');
    expect(getCategory(15, 'male').label).toBe('標準');
    expect(getCategory(22, 'male').label).toBe('高い');
    expect(getCategory(30, 'male').label).toBe('非常に高い');
  });

  it('categorizes female body fat correctly', () => {
    expect(getCategory(18, 'female').label).toBe('低い');
    expect(getCategory(25, 'female').label).toBe('標準');
    expect(getCategory(33, 'female').label).toBe('高い');
    expect(getCategory(40, 'female').label).toBe('非常に高い');
  });

  it('calculateBodyFat returns complete result', () => {
    const result = calculateBodyFat(170, 65, 30, 'male');
    expect(result.bmi).toBeCloseTo(22.49, 1);
    expect(result.bodyFatPercentage).toBeCloseTo(17.79, 0);
    expect(result.category.label).toBe('標準');
  });
});

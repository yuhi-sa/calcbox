import { describe, it, expect } from 'vitest';
import { calcBMI, getCategory, getIdealWeight, calculateBmi } from './bmi-logic';

describe('BMI calculations', () => {
  it('calculates BMI correctly', () => {
    expect(calcBMI(170, 65)).toBeCloseTo(22.49, 1);
  });

  it('categorizes BMI correctly', () => {
    expect(getCategory(17).label).toBe('やせ（低体重）');
    expect(getCategory(22).label).toBe('普通体重');
    expect(getCategory(27).label).toBe('肥満（1度）');
    expect(getCategory(33).label).toBe('肥満（2度）');
    expect(getCategory(38).label).toBe('肥満（3度）');
    expect(getCategory(42).label).toBe('肥満（4度）');
  });

  it('calculates ideal weight (BMI 22)', () => {
    const ideal = getIdealWeight(170);
    expect(ideal).toBeCloseTo(63.58, 1);
  });

  it('calculateBmi returns complete result', () => {
    const result = calculateBmi(170, 65);
    expect(result.bmi).toBeCloseTo(22.49, 1);
    expect(result.category.label).toBe('普通体重');
    expect(result.idealWeight).toBeCloseTo(63.58, 1);
    expect(result.weightDiff).toBeCloseTo(1.42, 1);
  });
});

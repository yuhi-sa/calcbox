import { describe, it, expect } from 'vitest';
import { calculateRentBudget } from './rent-budget-logic';

describe('Rent Budget Calculator', () => {
  it('calculates recommended rent from monthly income', () => {
    const result = calculateRentBudget(300000, false, false);
    expect(result.monthlyIncome).toBe(300000);
    expect(result.recommendedMin).toBe(75000);
    expect(result.recommendedMax).toBe(90000);
  });

  it('calculates from annual income with bonus included', () => {
    const result = calculateRentBudget(4800000, true, true);
    expect(result.monthlyIncome).toBe(400000);
    expect(result.recommendedMin).toBe(100000);
    expect(result.recommendedMax).toBe(120000);
  });

  it('calculates from annual income excluding bonus', () => {
    const result = calculateRentBudget(4800000, true, false, 2);
    // 4800000 / 14 = ~342857
    expect(result.monthlyIncome).toBe(342857);
    expect(result.recommendedMin).toBe(85714);
    expect(result.recommendedMax).toBe(102857);
  });

  it('shows warning when current rent exceeds 33%', () => {
    const result = calculateRentBudget(300000, false, false, 2, 110000);
    expect(result.warning).toBe('現在の家賃が月収の33%を超えています。家計の見直しを検討してください。');
  });

  it('does not show warning when current rent is within 33%', () => {
    const result = calculateRentBudget(300000, false, false, 2, 90000);
    expect(result.warning).toBeNull();
  });

  it('estimates utilities at 5% of monthly income', () => {
    const result = calculateRentBudget(300000, false, false);
    expect(result.utilitiesEstimate).toBe(15000);
  });
});

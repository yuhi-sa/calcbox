import { describe, it, expect } from 'vitest';
import { calcNutrition, calculateNutrition, FOOD_DATABASE } from './nutrition-logic';

describe('Nutrition calculations', () => {
  it('calculates nutrition for 100g of rice', () => {
    const rice = FOOD_DATABASE[0]; // 白米
    const result = calcNutrition(rice, 100);
    expect(result.calories).toBeCloseTo(168, 0);
    expect(result.protein).toBeCloseTo(2.5, 1);
    expect(result.fat).toBeCloseTo(0.3, 1);
    expect(result.carbs).toBeCloseTo(37.1, 1);
  });

  it('calculates nutrition for 200g (double)', () => {
    const rice = FOOD_DATABASE[0];
    const result = calcNutrition(rice, 200);
    expect(result.calories).toBeCloseTo(336, 0);
    expect(result.protein).toBeCloseTo(5.0, 1);
  });

  it('calculates totals for multiple foods', () => {
    const result = calculateNutrition([
      { foodIndex: 0, quantityGrams: 150 }, // rice 150g
      { foodIndex: 4, quantityGrams: 100 }, // chicken breast 100g
    ]);
    expect(result.entries).toHaveLength(2);
    // rice: 168*1.5=252, chicken: 108 => total 360
    expect(result.totalCalories).toBeCloseTo(360, 0);
    expect(result.totalProtein).toBeCloseTo(2.5 * 1.5 + 22.3, 0);
  });

  it('has at least 20 food items in database', () => {
    expect(FOOD_DATABASE.length).toBeGreaterThanOrEqual(20);
  });

  it('handles empty selection', () => {
    const result = calculateNutrition([]);
    expect(result.totalCalories).toBe(0);
    expect(result.entries).toHaveLength(0);
  });
});

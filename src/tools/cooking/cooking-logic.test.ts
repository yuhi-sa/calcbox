import { describe, it, expect } from 'vitest';
import { convertCookingUnit, INGREDIENTS } from './cooking-logic';

describe('Cooking Unit Converter', () => {
  it('converts tablespoon to mL (water)', () => {
    // water index = 0, 1 tablespoon = 15mL
    const result = convertCookingUnit({ value: 1, fromUnit: 'tablespoon', toUnit: 'ml', ingredientIndex: 0 });
    expect(result.outputValue).toBe(15);
  });

  it('converts teaspoon to mL', () => {
    // 1 teaspoon = 5mL
    const result = convertCookingUnit({ value: 1, fromUnit: 'teaspoon', toUnit: 'ml', ingredientIndex: 0 });
    expect(result.outputValue).toBe(5);
  });

  it('converts cup to mL (Japanese cup = 200mL)', () => {
    const result = convertCookingUnit({ value: 1, fromUnit: 'cup', toUnit: 'ml', ingredientIndex: 0 });
    expect(result.outputValue).toBe(200);
  });

  it('converts tablespoon of flour to grams', () => {
    // flour index = 1, density = 0.55 g/mL, 1 tbsp = 15mL, 15 * 0.55 = 8.25g
    const result = convertCookingUnit({ value: 1, fromUnit: 'tablespoon', toUnit: 'g', ingredientIndex: 1 });
    expect(result.outputValue).toBe(8.25);
  });

  it('converts tablespoon of sugar to grams', () => {
    // sugar index = 2, density = 0.6, 1 tbsp = 15mL, 15 * 0.6 = 9g
    const result = convertCookingUnit({ value: 1, fromUnit: 'tablespoon', toUnit: 'g', ingredientIndex: 2 });
    expect(result.outputValue).toBe(9);
  });

  it('converts grams of salt to tablespoons', () => {
    // salt index = 3, density = 1.2, 18g / 1.2 = 15mL = 1 tbsp
    const result = convertCookingUnit({ value: 18, fromUnit: 'g', toUnit: 'tablespoon', ingredientIndex: 3 });
    expect(result.outputValue).toBe(1);
  });

  it('mL and cc are equivalent', () => {
    const result = convertCookingUnit({ value: 100, fromUnit: 'ml', toUnit: 'cc', ingredientIndex: 0 });
    expect(result.outputValue).toBe(100);
  });

  it('has correct number of ingredients', () => {
    expect(INGREDIENTS.length).toBeGreaterThanOrEqual(8);
  });
});

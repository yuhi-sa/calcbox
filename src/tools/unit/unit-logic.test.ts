import { describe, it, expect } from 'vitest';
import { convert, getUnitsForCategory } from './unit-logic';

describe('unit conversion', () => {
  it('converts meters to centimeters', () => {
    expect(convert('length', 'm', 'cm', 1)).toBeCloseTo(100);
  });

  it('converts kilometers to miles', () => {
    expect(convert('length', 'km', 'mile', 1)).toBeCloseTo(0.6214, 3);
  });

  it('converts kg to lb', () => {
    expect(convert('weight', 'kg', 'lb', 1)).toBeCloseTo(2.2046, 3);
  });

  it('converts grams to ounces', () => {
    expect(convert('weight', 'g', 'oz', 100)).toBeCloseTo(3.5274, 3);
  });

  it('converts Celsius to Fahrenheit', () => {
    expect(convert('temperature', 'C', 'F', 100)).toBeCloseTo(212);
    expect(convert('temperature', 'C', 'F', 0)).toBeCloseTo(32);
  });

  it('converts Fahrenheit to Celsius', () => {
    expect(convert('temperature', 'F', 'C', 32)).toBeCloseTo(0);
  });

  it('converts Celsius to Kelvin', () => {
    expect(convert('temperature', 'C', 'K', 0)).toBeCloseTo(273.15);
  });

  it('converts m² to tsubo', () => {
    expect(convert('area', 'm2', 'tsubo', 3.305785)).toBeCloseTo(1, 1);
  });

  it('getUnitsForCategory returns units', () => {
    const units = getUnitsForCategory('length');
    expect(units.length).toBeGreaterThan(0);
    expect(units.find((u) => u.key === 'm')).toBeDefined();
  });

  it('throws for unknown unit', () => {
    expect(() => convert('length', 'm', 'unknown', 1)).toThrow();
  });
});

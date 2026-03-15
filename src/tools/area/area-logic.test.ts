import { describe, it, expect } from 'vitest';
import { calcRectangle, calcTriangle, calcCircle, calcTrapezoid, convertArea, calcArea } from './area-logic';

describe('area calculations', () => {
  it('calculates rectangle area', () => {
    expect(calcRectangle(5, 10)).toBe(50);
  });

  it('calculates triangle area', () => {
    expect(calcTriangle(6, 4)).toBe(12);
  });

  it('calculates circle area', () => {
    expect(calcCircle(10)).toBeCloseTo(Math.PI * 100);
  });

  it('calculates trapezoid area', () => {
    expect(calcTrapezoid(3, 5, 4)).toBe(16);
  });

  it('converts m² to tsubo correctly', () => {
    const result = convertArea(100);
    expect(result.tsubo).toBeCloseTo(30.25);
  });

  it('converts m² to jou correctly', () => {
    const result = convertArea(100);
    expect(result.jou).toBeCloseTo(60.5);
  });

  it('converts m² to ha correctly', () => {
    const result = convertArea(10000);
    expect(result.ha).toBeCloseTo(1);
  });

  it('calcArea returns all units for rectangle', () => {
    const result = calcArea('rectangle', { width: 10, height: 10 });
    expect(result.m2).toBe(100);
    expect(result.tsubo).toBeCloseTo(30.25);
    expect(result.ha).toBeCloseTo(0.01);
  });

  it('throws for missing dimensions', () => {
    expect(() => calcArea('rectangle', {})).toThrow();
    expect(() => calcArea('circle', {})).toThrow();
  });
});

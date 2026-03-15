import { describe, it, expect } from 'vitest';
import { calculateFuelCost, calculateDistanceFromBudget } from './fuel-cost-logic';

describe('Fuel Cost Calculator', () => {
  it('calculates fuel needed correctly', () => {
    const result = calculateFuelCost(100, 10, 170);
    expect(result.fuelNeeded).toBe(10);
  });

  it('calculates total cost correctly', () => {
    const result = calculateFuelCost(100, 10, 170);
    expect(result.totalCost).toBe(1700);
  });

  it('calculates cost per km correctly', () => {
    const result = calculateFuelCost(100, 10, 170);
    expect(result.costPerKm).toBe(17);
  });

  it('handles high fuel efficiency', () => {
    const result = calculateFuelCost(200, 25, 160);
    expect(result.fuelNeeded).toBe(8);
    expect(result.totalCost).toBe(1280);
    expect(result.costPerKm).toBe(6.4);
  });

  it('calculates max distance from budget', () => {
    const result = calculateDistanceFromBudget(5000, 15, 170);
    expect(result.fuelUsable).toBeCloseTo(29.41, 1);
    expect(result.maxDistance).toBeCloseTo(441.18, 0);
  });

  it('calculates distance from small budget', () => {
    const result = calculateDistanceFromBudget(1000, 10, 170);
    expect(result.fuelUsable).toBeCloseTo(5.88, 1);
    expect(result.maxDistance).toBeCloseTo(58.82, 0);
  });
});

import { describe, it, expect } from 'vitest';
import { getBaseTax, calculateCarTax } from './car-tax-logic';

describe('Car Tax Calculator', () => {
  it('calculates kei car tax', () => {
    const result = calculateCarTax('軽自動車', 660, false);
    expect(result.baseTax).toBe(10800);
    expect(result.totalTax).toBe(10800);
    expect(result.bracket).toBe('軽自動車');
  });

  it('calculates tax for 1500cc car', () => {
    const result = calculateCarTax('普通車', 1500, false);
    expect(result.baseTax).toBe(30500);
    expect(result.totalTax).toBe(30500);
  });

  it('calculates tax for 2000cc car', () => {
    const result = calculateCarTax('普通車', 2000, false);
    expect(result.baseTax).toBe(36000);
    expect(result.totalTax).toBe(36000);
  });

  it('applies 15% surcharge for cars over 13 years', () => {
    const result = calculateCarTax('普通車', 2000, true);
    expect(result.baseTax).toBe(36000);
    expect(result.surcharge).toBe(Math.floor(36000 * 0.15));
    expect(result.totalTax).toBe(36000 + Math.floor(36000 * 0.15));
    expect(result.isOverAge).toBe(true);
  });

  it('calculates tax for 6000cc超', () => {
    const result = calculateCarTax('普通車', 7000, false);
    expect(result.baseTax).toBe(110000);
    expect(result.bracket).toBe('6,000cc超');
  });

  it('returns correct bracket for boundary values', () => {
    const { tax: tax1000 } = getBaseTax('普通車', 1000);
    expect(tax1000).toBe(25000);

    const { tax: tax1001 } = getBaseTax('普通車', 1001);
    expect(tax1001).toBe(30500);
  });
});

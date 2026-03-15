import { describe, it, expect } from 'vitest';
import { calculateTax, calculateMultiItemTax } from './tax-logic';

describe('tax calculations', () => {
  it('calculates tax-excluded to tax-included at 10%', () => {
    const result = calculateTax(1000, 0.10, 'exclude-to-include');
    expect(result.resultPrice).toBe(1100);
    expect(result.taxAmount).toBe(100);
    expect(result.originalPrice).toBe(1000);
  });

  it('calculates tax-included to tax-excluded at 10%', () => {
    const result = calculateTax(1100, 0.10, 'include-to-exclude');
    expect(result.resultPrice).toBe(1000);
    expect(result.taxAmount).toBe(100);
  });

  it('calculates with 8% reduced rate', () => {
    const result = calculateTax(1000, 0.08, 'exclude-to-include');
    expect(result.resultPrice).toBe(1080);
    expect(result.taxAmount).toBe(80);
  });

  it('calculates multi-item tax', () => {
    const result = calculateMultiItemTax([
      { price: 500, rate: 0.10 },
      { price: 300, rate: 0.08 },
    ]);
    expect(result.subtotal).toBe(800);
    expect(result.totalTax).toBe(50 + 24); // floor(500*0.10) + floor(300*0.08)
    expect(result.total).toBe(874);
  });
});

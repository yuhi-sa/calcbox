import { describe, it, expect } from 'vitest';
import { convert, formatCurrencyNumber, fallbackRates } from './currency-logic';

describe('currency conversion', () => {
  it('converts USD to JPY', () => {
    const result = convert(1, 'USD', 'JPY', fallbackRates);
    expect(result).toBeCloseTo(149.50, 0);
  });

  it('converts JPY to USD', () => {
    const result = convert(149.50, 'JPY', 'USD', fallbackRates);
    expect(result).toBeCloseTo(1, 1);
  });

  it('converts same currency returns same amount', () => {
    const result = convert(100, 'USD', 'USD', fallbackRates);
    expect(result).toBeCloseTo(100, 2);
  });

  it('formats JPY without decimals', () => {
    expect(formatCurrencyNumber(1000.5, 'JPY')).toBe('1001');
  });

  it('formats USD with 2 decimals', () => {
    expect(formatCurrencyNumber(10.5, 'USD')).toBe('10.50');
  });
});

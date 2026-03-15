import { describe, it, expect } from 'vitest';
import { convertBase, isValidForBase } from './base-converter-logic';

describe('base-converter', () => {
  it('converts decimal 255 to all bases', () => {
    const result = convertBase('255', 10);
    expect(result.binary).toBe('11111111');
    expect(result.octal).toBe('377');
    expect(result.decimal).toBe('255');
    expect(result.hex).toBe('FF');
  });

  it('converts binary 1010 to decimal 10', () => {
    const result = convertBase('1010', 2);
    expect(result.decimal).toBe('10');
    expect(result.hex).toBe('A');
  });

  it('converts hex FF to decimal 255', () => {
    const result = convertBase('FF', 16);
    expect(result.decimal).toBe('255');
    expect(result.binary).toBe('11111111');
  });

  it('returns empty for empty input', () => {
    const result = convertBase('', 10);
    expect(result.decimal).toBe('');
  });

  it('throws on invalid value', () => {
    expect(() => convertBase('GG', 16)).toThrow();
  });

  it('validates base correctly', () => {
    expect(isValidForBase('1010', 2)).toBe(true);
    expect(isValidForBase('29', 2)).toBe(false);
    expect(isValidForBase('FF', 16)).toBe(true);
  });
});

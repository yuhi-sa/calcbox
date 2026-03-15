import { describe, it, expect } from 'vitest';
import { generatePassword, evaluateStrength, buildCharset, CHARSETS } from './password-logic';

describe('password generation', () => {
  it('generates password of specified length', () => {
    const pw = generatePassword(16, CHARSETS.lowercase);
    expect(pw).toHaveLength(16);
  });

  it('uses only characters from charset', () => {
    const charset = CHARSETS.numbers;
    const pw = generatePassword(100, charset);
    for (const ch of pw) {
      expect(charset).toContain(ch);
    }
  });

  it('buildCharset combines selected character sets', () => {
    const charset = buildCharset({ uppercase: true, lowercase: false, numbers: true, symbols: false });
    expect(charset).toBe(CHARSETS.uppercase + CHARSETS.numbers);
  });

  it('evaluates weak strength', () => {
    expect(evaluateStrength(8, 10).label).toBe('弱');
  });

  it('evaluates very strong strength', () => {
    expect(evaluateStrength(32, 92).label).toBe('非常に強い');
  });
});

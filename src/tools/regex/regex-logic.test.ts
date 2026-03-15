import { describe, it, expect } from 'vitest';
import { testRegex, validatePattern } from './regex-logic';

describe('regex', () => {
  it('finds all matches with global flag', () => {
    const result = testRegex('\\d+', 'g', 'abc 123 def 456');
    expect(result.count).toBe(2);
    expect(result.matches[0].match).toBe('123');
    expect(result.matches[1].match).toBe('456');
  });

  it('finds first match without global flag', () => {
    const result = testRegex('\\d+', '', 'abc 123 def 456');
    expect(result.count).toBe(1);
    expect(result.matches[0].match).toBe('123');
    expect(result.matches[0].index).toBe(4);
  });

  it('captures groups', () => {
    const result = testRegex('(\\w+)@(\\w+)', '', 'user@example');
    expect(result.matches[0].groups).toEqual(['user', 'example']);
  });

  it('returns empty for no match', () => {
    const result = testRegex('xyz', 'g', 'abc def');
    expect(result.count).toBe(0);
  });

  it('handles invalid pattern', () => {
    const result = testRegex('[invalid', '', 'test');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('validates pattern', () => {
    expect(validatePattern('\\d+', 'g').valid).toBe(true);
    expect(validatePattern('[', '').valid).toBe(false);
  });
});

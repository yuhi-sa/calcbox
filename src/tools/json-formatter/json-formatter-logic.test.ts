import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, validateJson } from './json-formatter-logic';

describe('json-formatter', () => {
  it('formats JSON with 2-space indent', () => {
    const result = formatJson('{"a":1,"b":2}', 2);
    expect(result.valid).toBe(true);
    expect(result.formatted).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('formats JSON with 4-space indent', () => {
    const result = formatJson('{"a":1}', 4);
    expect(result.formatted).toContain('    "a"');
  });

  it('minifies JSON', () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": 2\n}');
    expect(result.valid).toBe(true);
    expect(result.formatted).toBe('{"a":1,"b":2}');
  });

  it('returns error for invalid JSON', () => {
    const result = formatJson('{invalid}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('validates correct JSON', () => {
    expect(validateJson('{"key":"value"}')).toEqual({ valid: true });
  });

  it('validates incorrect JSON', () => {
    const result = validateJson('{bad}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

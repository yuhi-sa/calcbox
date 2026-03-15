import { describe, it, expect } from 'vitest';
import { numericToResult, permissionsToResult, permissionToDigit, digitToPermission } from './chmod-logic';

describe('chmod', () => {
  it('converts 755 to symbolic', () => {
    const result = numericToResult('755');
    expect(result.symbolic).toBe('rwxr-xr-x');
    expect(result.lsStyle).toBe('-rwxr-xr-x');
  });

  it('converts 644 to symbolic', () => {
    const result = numericToResult('644');
    expect(result.symbolic).toBe('rw-r--r--');
  });

  it('converts 000 to symbolic', () => {
    const result = numericToResult('000');
    expect(result.symbolic).toBe('---------');
  });

  it('converts permissions to numeric', () => {
    const result = permissionsToResult(
      { read: true, write: true, execute: true },
      { read: true, write: false, execute: true },
      { read: true, write: false, execute: true }
    );
    expect(result.numeric).toBe('755');
  });

  it('converts digit to permission', () => {
    expect(digitToPermission(7)).toEqual({ read: true, write: true, execute: true });
    expect(digitToPermission(4)).toEqual({ read: true, write: false, execute: false });
    expect(digitToPermission(0)).toEqual({ read: false, write: false, execute: false });
  });

  it('converts permission to digit', () => {
    expect(permissionToDigit({ read: true, write: true, execute: true })).toBe(7);
    expect(permissionToDigit({ read: true, write: false, execute: false })).toBe(4);
  });

  it('throws on invalid numeric', () => {
    expect(() => numericToResult('999')).toThrow();
    expect(() => numericToResult('12')).toThrow();
  });
});

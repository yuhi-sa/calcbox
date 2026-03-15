import { describe, it, expect } from 'vitest';
import { convertBytes } from './byte-converter-logic';

describe('byte-converter', () => {
  it('converts 1 KB to 1024 B (binary)', () => {
    const result = convertBytes(1, 'KB');
    expect(result.binary.B).toContain('1,024');
  });

  it('converts 1 KB to 1000 B (SI)', () => {
    const result = convertBytes(1, 'KB');
    expect(result.si.B).toContain('1,000');
  });

  it('converts 1 GB to 1024 MB (binary)', () => {
    const result = convertBytes(1, 'GB');
    expect(result.binary.MB).toContain('1,024');
  });

  it('converts 0 bytes', () => {
    const result = convertBytes(0, 'B');
    expect(result.binary.B).toBe('0');
    expect(result.binary.KB).toBe('0');
  });

  it('converts 1 MB to KB', () => {
    const result = convertBytes(1, 'MB');
    expect(result.binary.KB).toContain('1,024');
    expect(result.si.KB).toContain('1,000');
  });
});

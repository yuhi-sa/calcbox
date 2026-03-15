import { describe, it, expect } from 'vitest';
import { getAllPaperSizes, filterPaperSizes, getSeriesList } from './paper-size-logic';

describe('Paper Size Reference', () => {
  it('returns all paper sizes including A, B, and other series', () => {
    const sizes = getAllPaperSizes();
    expect(sizes.length).toBeGreaterThanOrEqual(28);
    const names = sizes.map((s) => s.name);
    expect(names).toContain('A4');
    expect(names).toContain('B5');
    expect(names).toContain('はがき');
    expect(names).toContain('L判');
  });

  it('A4 has correct dimensions', () => {
    const sizes = getAllPaperSizes();
    const a4 = sizes.find((s) => s.name === 'A4')!;
    expect(a4.widthMm).toBe(210);
    expect(a4.heightMm).toBe(297);
    expect(a4.widthInch).toBeCloseTo(8.27, 1);
    expect(a4.heightInch).toBeCloseTo(11.69, 1);
  });

  it('filters by name query', () => {
    const results = filterPaperSizes('A4');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('A4');
  });

  it('filters by series', () => {
    const results = filterPaperSizes('', 'A');
    expect(results.length).toBe(11); // A0-A10
    results.forEach((s) => expect(s.series).toBe('A'));
  });

  it('returns series list', () => {
    const series = getSeriesList();
    expect(series).toContain('A');
    expect(series).toContain('B (JIS)');
    expect(series).toContain('その他');
  });
});

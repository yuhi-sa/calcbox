import { describe, it, expect } from 'vitest';
import { westernToWareki, warekiToWestern, getEraNames } from './wareki-logic';

describe('Wareki conversion', () => {
  it('converts western year to wareki', () => {
    const result = westernToWareki(2025);
    expect(result).not.toBeNull();
    expect(result!.eraName).toBe('令和');
    expect(result!.eraYear).toBe(7);
  });

  it('converts wareki to western year', () => {
    const result = warekiToWestern('平成', 1);
    expect(result).not.toBeNull();
    expect(result!.westernYear).toBe(1989);
  });

  it('handles era-first year as 元年', () => {
    const result = westernToWareki(2019);
    expect(result!.display).toContain('元');
  });

  it('handles Showa era', () => {
    const result = westernToWareki(1970);
    expect(result!.eraName).toBe('昭和');
    expect(result!.eraYear).toBe(45);
  });

  it('returns null for year before Meiji', () => {
    const result = westernToWareki(1800);
    expect(result).toBeNull();
  });

  it('returns null for invalid era name', () => {
    const result = warekiToWestern('不明', 1);
    expect(result).toBeNull();
  });

  it('returns all era names', () => {
    const names = getEraNames();
    expect(names).toContain('明治');
    expect(names).toContain('令和');
    expect(names.length).toBe(5);
  });
});

import { describe, it, expect } from 'vitest';
import { convertShoeSize } from './shoe-size-logic';

describe('Shoe Size Converter', () => {
  it('converts men JP 26 to other systems', () => {
    const result = convertShoeSize({ value: 26, fromSystem: 'jp', gender: 'men' });
    expect(result.jp).toBe(26);
    expect(result.us).toBe(8);     // 26 - 18
    expect(result.uk).toBe(7.5);   // 26 - 18.5
  });

  it('converts women JP 24 to other systems', () => {
    const result = convertShoeSize({ value: 24, fromSystem: 'jp', gender: 'women' });
    expect(result.jp).toBe(24);
    expect(result.us).toBe(7);     // 24 - 17
    expect(result.uk).toBe(6);     // 24 - 18
  });

  it('converts men US 9 to JP', () => {
    const result = convertShoeSize({ value: 9, fromSystem: 'us', gender: 'men' });
    expect(result.jp).toBe(27);    // 9 + 18
    expect(result.us).toBe(9);
  });

  it('converts women US 7 to JP', () => {
    const result = convertShoeSize({ value: 7, fromSystem: 'us', gender: 'women' });
    expect(result.jp).toBe(24);    // 7 + 17
  });

  it('converts UK to JP for men', () => {
    const result = convertShoeSize({ value: 8, fromSystem: 'uk', gender: 'men' });
    expect(result.jp).toBe(26.5);  // 8 + 18.5
  });

  it('returns gender in result', () => {
    const menResult = convertShoeSize({ value: 26, fromSystem: 'jp', gender: 'men' });
    expect(menResult.gender).toBe('men');
    const womenResult = convertShoeSize({ value: 24, fromSystem: 'jp', gender: 'women' });
    expect(womenResult.gender).toBe('women');
  });
});

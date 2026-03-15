import { describe, it, expect } from 'vitest';
import { getWesternZodiac, getChineseZodiac, getZodiac } from './zodiac-logic';

describe('Zodiac calculations', () => {
  it('identifies Aries for April 1', () => {
    const result = getWesternZodiac(4, 1);
    expect(result.sign).toBe('Aries');
    expect(result.japaneseName).toBe('おひつじ座');
  });

  it('identifies Capricorn for December 25', () => {
    const result = getWesternZodiac(12, 25);
    expect(result.sign).toBe('Capricorn');
    expect(result.japaneseName).toBe('やぎ座');
  });

  it('identifies Capricorn for January 15', () => {
    const result = getWesternZodiac(1, 15);
    expect(result.sign).toBe('Capricorn');
  });

  it('calculates Chinese zodiac for 2024 (Dragon)', () => {
    const result = getChineseZodiac(2024);
    expect(result.animal).toBe('Dragon');
    expect(result.kanji).toBe('辰');
  });

  it('calculates Chinese zodiac for 2020 (Rat)', () => {
    const result = getChineseZodiac(2020);
    expect(result.animal).toBe('Rat');
    expect(result.kanji).toBe('子');
  });

  it('returns both zodiacs from getZodiac', () => {
    const result = getZodiac(new Date(2000, 6, 15)); // July 15, 2000
    expect(result.western.sign).toBe('Cancer');
    expect(result.chinese.animal).toBe('Dragon');
  });

  it('handles boundary date for Pisces/Aries', () => {
    expect(getWesternZodiac(3, 20).sign).toBe('Pisces');
    expect(getWesternZodiac(3, 21).sign).toBe('Aries');
  });
});

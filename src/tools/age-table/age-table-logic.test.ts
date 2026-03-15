import { describe, it, expect } from 'vitest';
import { getZodiac, getEraForYear, generateAgeTable, filterTable } from './age-table-logic';

describe('Age table logic', () => {
  it('calculates Chinese zodiac correctly', () => {
    // 2024 is Year of the Dragon (辰), 2024%12=8, index=(8-4)=4 => 辰
    expect(getZodiac(2024)).toBe('辰');
    // 2020 is Year of the Rat (子), 2020%12=4, index=0 => 子
    expect(getZodiac(2020)).toBe('子');
    // 2023 is Year of the Rabbit (卯)
    expect(getZodiac(2023)).toBe('卯');
  });

  it('gets era for year correctly', () => {
    expect(getEraForYear(1990)).toEqual({ name: '平成', eraYear: 2 });
    expect(getEraForYear(2025)).toEqual({ name: '令和', eraYear: 7 });
    expect(getEraForYear(1950)).toEqual({ name: '昭和', eraYear: 25 });
    expect(getEraForYear(1800)).toBeNull();
  });

  it('generates age table with correct size', () => {
    const rows = generateAgeTable(2025, 2020, 2025);
    expect(rows.length).toBe(6);
    expect(rows[0].westernYear).toBe(2020);
    expect(rows[0].age).toBe(5);
    expect(rows[5].westernYear).toBe(2025);
    expect(rows[5].age).toBe(0);
  });

  it('filters table by year number', () => {
    const rows = generateAgeTable(2025, 1990, 2000);
    const filtered = filterTable(rows, '1995');
    expect(filtered.length).toBe(1);
    expect(filtered[0].westernYear).toBe(1995);
  });

  it('filters table by era name', () => {
    const rows = generateAgeTable(2025, 1985, 1995);
    const filtered = filterTable(rows, '平成');
    expect(filtered.length).toBe(7); // 1989-1995
    expect(filtered[0].eraName).toBe('平成');
  });

  it('returns all rows when query is empty', () => {
    const rows = generateAgeTable(2025, 2020, 2025);
    expect(filterTable(rows, '').length).toBe(6);
    expect(filterTable(rows, '  ').length).toBe(6);
  });
});

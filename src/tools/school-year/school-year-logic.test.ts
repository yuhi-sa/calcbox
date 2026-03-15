import { describe, it, expect } from 'vitest';
import { getSchoolStartYear, calculateSchoolYears } from './school-year-logic';

describe('School Year Calculator', () => {
  it('child born on April 2 enters school the following year', () => {
    // Born April 2, 2018 -> enters elementary April 2025
    expect(getSchoolStartYear(2018, 4, 2)).toBe(2025);
  });

  it('child born on April 1 enters school the same year they turn 6', () => {
    // Born April 1, 2018 -> enters elementary April 2024
    // (grouped with kids born April 2, 2017 - April 1, 2018)
    expect(getSchoolStartYear(2018, 4, 1)).toBe(2024);
  });

  it('child born in January enters school in year they turn 6', () => {
    // Born Jan 15, 2018 -> enters elementary April 2024
    expect(getSchoolStartYear(2018, 1, 15)).toBe(2024);
  });

  it('child born in December enters school the next year after turning 6', () => {
    // Born Dec 25, 2018 -> enters elementary April 2025
    expect(getSchoolStartYear(2018, 12, 25)).toBe(2025);
  });

  it('calculates all school milestones correctly', () => {
    const result = calculateSchoolYears(2018, 6, 15);
    expect(result.milestones).toHaveLength(4);

    const elementary = result.milestones[0];
    expect(elementary.label).toBe('小学校');
    expect(elementary.entryYear).toBe(2025);
    expect(elementary.graduationYear).toBe(2031);

    const middleSchool = result.milestones[1];
    expect(middleSchool.label).toBe('中学校');
    expect(middleSchool.entryYear).toBe(2031);
    expect(middleSchool.graduationYear).toBe(2034);

    const highSchool = result.milestones[2];
    expect(highSchool.label).toBe('高校');
    expect(highSchool.entryYear).toBe(2034);
    expect(highSchool.graduationYear).toBe(2037);

    const university = result.milestones[3];
    expect(university.label).toBe('大学（4年制）');
    expect(university.entryYear).toBe(2037);
    expect(university.graduationYear).toBe(2041);
  });

  it('formats birth date correctly', () => {
    const result = calculateSchoolYears(2020, 3, 5);
    expect(result.birthDate).toBe('2020年03月05日');
  });

  it('displays milestone string correctly', () => {
    const result = calculateSchoolYears(2018, 6, 15);
    expect(result.milestones[0].display).toBe('2025年4月入学 - 2031年3月卒業');
  });
});

import { describe, it, expect } from 'vitest';
import { gradeToPoints, calculateGpa, getAllGrades } from './gpa-logic';

describe('GPA calculations', () => {
  it('converts letter grades to points', () => {
    expect(gradeToPoints('A+')).toBe(4.0);
    expect(gradeToPoints('A')).toBe(4.0);
    expect(gradeToPoints('B+')).toBe(3.3);
    expect(gradeToPoints('C')).toBe(2.0);
    expect(gradeToPoints('F')).toBe(0.0);
  });

  it('converts Japanese grades to points', () => {
    expect(gradeToPoints('秀')).toBe(4.0);
    expect(gradeToPoints('優')).toBe(3.0);
    expect(gradeToPoints('良')).toBe(2.0);
    expect(gradeToPoints('可')).toBe(1.0);
    expect(gradeToPoints('不可')).toBe(0.0);
  });

  it('returns null for invalid grades', () => {
    expect(gradeToPoints('X')).toBeNull();
    expect(gradeToPoints('')).toBeNull();
  });

  it('calculates weighted GPA correctly', () => {
    const courses = [
      { name: 'Math', grade: 'A', credits: 3 },
      { name: 'English', grade: 'B', credits: 3 },
      { name: 'Science', grade: 'A-', credits: 4 },
    ];
    const result = calculateGpa(courses);
    // (4.0*3 + 3.0*3 + 3.7*4) / (3+3+4) = (12+9+14.8) / 10 = 3.58
    expect(result.gpa).toBeCloseTo(3.58, 2);
    expect(result.totalCredits).toBe(10);
  });

  it('calculates GPA with Japanese grades', () => {
    const courses = [
      { name: '数学', grade: '秀', credits: 2 },
      { name: '英語', grade: '良', credits: 2 },
    ];
    const result = calculateGpa(courses);
    // (4.0*2 + 2.0*2) / 4 = 3.0
    expect(result.gpa).toBe(3.0);
  });

  it('returns 0 GPA for empty courses', () => {
    expect(calculateGpa([]).gpa).toBe(0);
  });

  it('getAllGrades returns all supported grades', () => {
    const grades = getAllGrades();
    expect(grades).toContain('A+');
    expect(grades).toContain('秀');
    expect(grades).toContain('不可');
  });
});

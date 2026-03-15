import { describe, it, expect } from 'vitest';
import { dateDiff, addDays, formatDate, parseDate } from './days-logic';

describe('days calculations', () => {
  it('calculates difference in days between two dates', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const result = dateDiff(start, end);
    expect(result.days).toBe(30);
  });

  it('calculates difference in weeks', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-15');
    const result = dateDiff(start, end);
    expect(result.weeks).toBe(2);
  });

  it('calculates difference in months', () => {
    const start = new Date('2024-01-15');
    const end = new Date('2024-04-15');
    const result = dateDiff(start, end);
    expect(result.months).toBe(3);
  });

  it('handles reversed date order (absolute values)', () => {
    const start = new Date('2024-03-01');
    const end = new Date('2024-01-01');
    const result = dateDiff(start, end);
    expect(result.days).toBeGreaterThan(0);
  });

  it('adds days to a date', () => {
    const start = new Date('2024-01-01');
    const result = addDays(start, 10);
    expect(result.resultDate.getDate()).toBe(11);
  });

  it('adds days across month boundary', () => {
    const start = new Date('2024-01-30');
    const result = addDays(start, 5);
    expect(result.resultDate.getMonth()).toBe(1); // February
    expect(result.resultDate.getDate()).toBe(4);
  });

  it('subtracts days with negative value', () => {
    const start = new Date('2024-01-10');
    const result = addDays(start, -5);
    expect(result.resultDate.getDate()).toBe(5);
  });

  it('formats date correctly', () => {
    const date = new Date('2024-01-01');
    const formatted = formatDate(date);
    expect(formatted).toContain('2024年');
    expect(formatted).toContain('01月');
    expect(formatted).toContain('01日');
  });

  it('parseDate throws for invalid input', () => {
    expect(() => parseDate('invalid')).toThrow();
  });
});

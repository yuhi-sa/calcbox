import { describe, it, expect } from 'vitest';
import { describeCron, getNextExecutions, parseCron } from './cron-logic';

describe('cron', () => {
  it('describes every minute', () => {
    expect(describeCron('* * * * *')).toBe('毎分実行');
  });

  it('describes hourly', () => {
    expect(describeCron('0 * * * *')).toBe('毎時0分に実行');
  });

  it('describes daily', () => {
    expect(describeCron('0 0 * * *')).toBe('毎日 0:00 に実行');
  });

  it('describes with day of week', () => {
    const desc = describeCron('0 0 * * 1');
    expect(desc).toContain('月曜');
  });

  it('calculates next executions for every minute', () => {
    const from = new Date('2024-01-01T00:00:00');
    const results = getNextExecutions('* * * * *', 3, from);
    expect(results).toHaveLength(3);
  });

  it('returns error for invalid expression', () => {
    const result = parseCron('invalid');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('parses valid expression', () => {
    const result = parseCron('0 0 * * *');
    expect(result.valid).toBe(true);
    expect(result.description).toBe('毎日 0:00 に実行');
  });
});

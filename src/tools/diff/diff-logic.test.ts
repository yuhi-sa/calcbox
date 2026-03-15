import { describe, it, expect } from 'vitest';
import { computeDiff, getDiffStats } from './diff-logic';

describe('diff', () => {
  it('detects identical texts', () => {
    const diff = computeDiff('hello\nworld', 'hello\nworld');
    expect(diff).toHaveLength(2);
    expect(diff.every(d => d.status === 'same')).toBe(true);
  });

  it('detects added lines', () => {
    const diff = computeDiff('line1', 'line1\nline2');
    const stats = getDiffStats(diff);
    expect(stats.same).toBe(1);
    expect(stats.added).toBe(1);
    expect(stats.removed).toBe(0);
  });

  it('detects removed lines', () => {
    const diff = computeDiff('line1\nline2', 'line1');
    const stats = getDiffStats(diff);
    expect(stats.same).toBe(1);
    expect(stats.removed).toBe(1);
    expect(stats.added).toBe(0);
  });

  it('handles completely different texts', () => {
    const diff = computeDiff('aaa\nbbb', 'ccc\nddd');
    const stats = getDiffStats(diff);
    expect(stats.removed).toBe(2);
    expect(stats.added).toBe(2);
    expect(stats.same).toBe(0);
  });

  it('handles empty texts', () => {
    const diff = computeDiff('', '');
    expect(diff).toHaveLength(1); // one empty line
    expect(diff[0].status).toBe('same');
  });

  it('handles mixed changes', () => {
    const diff = computeDiff('a\nb\nc\nd', 'a\nx\nc\ny');
    const stats = getDiffStats(diff);
    expect(stats.same).toBe(2); // a, c
    expect(stats.added).toBe(2); // x, y
    expect(stats.removed).toBe(2); // b, d
  });
});

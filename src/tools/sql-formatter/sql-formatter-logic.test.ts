import { describe, it, expect } from 'vitest';
import { formatSQL, uppercaseKeywords } from './sql-formatter-logic';

describe('sql-formatter', () => {
  it('uppercases SQL keywords', () => {
    const result = uppercaseKeywords('select id from users where name = "test"');
    expect(result).toContain('SELECT');
    expect(result).toContain('FROM');
    expect(result).toContain('WHERE');
  });

  it('formats simple SELECT query', () => {
    const result = formatSQL('select id, name from users where active = 1');
    expect(result).toContain('SELECT');
    expect(result).toContain('\nFROM');
    expect(result).toContain('\nWHERE');
  });

  it('indents AND/OR sub-clauses', () => {
    const result = formatSQL('select * from users where a = 1 and b = 2 or c = 3');
    const lines = result.split('\n');
    const andLine = lines.find(l => l.trim().startsWith('AND'));
    const orLine = lines.find(l => l.trim().startsWith('OR'));
    expect(andLine).toBeDefined();
    expect(andLine!.startsWith('  ')).toBe(true);
    expect(orLine).toBeDefined();
    expect(orLine!.startsWith('  ')).toBe(true);
  });

  it('handles GROUP BY and ORDER BY', () => {
    const result = formatSQL('select dept, count(*) from employees group by dept order by count(*) desc');
    expect(result).toContain('\nGROUP BY');
    expect(result).toContain('\nORDER BY');
  });

  it('returns empty string for empty input', () => {
    expect(formatSQL('')).toBe('');
    expect(formatSQL('   ')).toBe('');
  });

  it('handles JOIN queries', () => {
    const result = formatSQL('select u.id from users u join orders o on u.id = o.user_id');
    expect(result).toContain('JOIN');
    expect(result).toContain('\nJOIN');
  });
});

import { describe, it, expect } from 'vitest';
import { filterStatusCodes, getStatusByCode, HTTP_STATUS_CODES } from './http-status-logic';

describe('http-status', () => {
  it('returns all status codes with no filter', () => {
    const result = filterStatusCodes('', 'すべて');
    expect(result.length).toBe(HTTP_STATUS_CODES.length);
  });

  it('filters by category', () => {
    const result = filterStatusCodes('', '2xx');
    expect(result.every((s) => s.category === '2xx')).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('searches by code', () => {
    const result = filterStatusCodes('404', 'すべて');
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(404);
  });

  it('searches by name', () => {
    const result = filterStatusCodes('not found', 'すべて');
    expect(result.some((s) => s.code === 404)).toBe(true);
  });

  it('combines search and category filter', () => {
    const result = filterStatusCodes('error', '5xx');
    expect(result.every((s) => s.category === '5xx')).toBe(true);
  });

  it('gets status by code', () => {
    const status = getStatusByCode(200);
    expect(status).toBeDefined();
    expect(status!.name).toBe('OK');
  });

  it('returns undefined for unknown code', () => {
    expect(getStatusByCode(999)).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';
import { generateUUIDv4, validateUUID } from './uuid-logic';

describe('UUID generation and validation', () => {
  it('generates valid UUID v4', () => {
    const uuid = generateUUIDv4();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('generates unique UUIDs', () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i++) uuids.add(generateUUIDv4());
    expect(uuids.size).toBe(100);
  });

  it('validates correct UUID', () => {
    const uuid = generateUUIDv4();
    const result = validateUUID(uuid);
    expect(result.valid).toBe(true);
    expect(result.version).toBe('4');
  });

  it('rejects invalid UUID', () => {
    expect(validateUUID('not-a-uuid').valid).toBe(false);
    expect(validateUUID('').valid).toBe(false);
  });

  it('validates UUID v1 format', () => {
    const result = validateUUID('550e8400-e29b-11d4-a716-446655440000');
    expect(result.valid).toBe(true);
    expect(result.version).toBe('1');
  });
});

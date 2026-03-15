import { describe, it, expect } from 'vitest';
import { decodeJwt, isValidJwtFormat } from './jwt-logic';

// Test JWT: {"alg":"HS256","typ":"JWT"}.{"sub":"1234567890","name":"John Doe","iat":1516239022}
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('jwt', () => {
  it('decodes JWT header', () => {
    const result = decodeJwt(TEST_TOKEN);
    expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' });
  });

  it('decodes JWT payload', () => {
    const result = decodeJwt(TEST_TOKEN);
    expect(result.payload.sub).toBe('1234567890');
    expect(result.payload.name).toBe('John Doe');
  });

  it('returns null expiration when no exp claim', () => {
    const result = decodeJwt(TEST_TOKEN);
    expect(result.isExpired).toBeNull();
    expect(result.expiresAt).toBeNull();
  });

  it('throws on invalid token', () => {
    expect(() => decodeJwt('invalid')).toThrow();
    expect(() => decodeJwt('a.b')).toThrow();
  });

  it('validates JWT format', () => {
    expect(isValidJwtFormat(TEST_TOKEN)).toBe(true);
    expect(isValidJwtFormat('invalid')).toBe(false);
    expect(isValidJwtFormat('a.b')).toBe(false);
  });
});

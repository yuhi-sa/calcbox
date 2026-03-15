import { describe, it, expect } from 'vitest';
import { computeHash, computeAllHashes } from './hash-logic';

// Note: crypto.subtle is available in Node.js 15+ and vitest
describe('hash generation', () => {
  it('generates SHA-256 hash', async () => {
    const hash = await computeHash('SHA-256', 'hello');
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('generates SHA-1 hash', async () => {
    const hash = await computeHash('SHA-1', 'hello');
    expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });

  it('generates all hashes at once', async () => {
    const result = await computeAllHashes('test');
    expect(result.sha1).toHaveLength(40);
    expect(result.sha256).toHaveLength(64);
    expect(result.sha512).toHaveLength(128);
  });

  it('returns different hashes for different inputs', async () => {
    const hash1 = await computeHash('SHA-256', 'hello');
    const hash2 = await computeHash('SHA-256', 'world');
    expect(hash1).not.toBe(hash2);
  });
});

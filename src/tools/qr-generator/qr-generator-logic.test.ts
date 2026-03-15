import { describe, it, expect } from 'vitest';
import { validateInput, buildQrUrl, generateQrCode } from './qr-generator-logic';

describe('qr-generator', () => {
  it('validates empty input', () => {
    expect(validateInput('').isValid).toBe(false);
    expect(validateInput('   ').isValid).toBe(false);
  });

  it('validates valid input', () => {
    expect(validateInput('hello').isValid).toBe(true);
    expect(validateInput('https://example.com').isValid).toBe(true);
  });

  it('rejects text over 2048 characters', () => {
    const longText = 'a'.repeat(2049);
    const result = validateInput(longText);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('builds correct QR URL', () => {
    const url = buildQrUrl('hello world', 200);
    expect(url).toBe('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=hello%20world');
  });

  it('encodes special characters in URL', () => {
    const url = buildQrUrl('https://example.com?q=test&a=1', 300);
    expect(url).toContain('data=https%3A%2F%2Fexample.com');
  });

  it('generates QR code with valid input', () => {
    const result = generateQrCode({ text: 'test', size: 200 });
    expect(result.isValid).toBe(true);
    expect(result.url).toContain('api.qrserver.com');
  });

  it('clamps size to valid range', () => {
    const small = generateQrCode({ text: 'test', size: 10 });
    expect(small.url).toContain('size=100x100');

    const large = generateQrCode({ text: 'test', size: 5000 });
    expect(large.url).toContain('size=1000x1000');
  });
});

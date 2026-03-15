import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode, urlEncode, urlDecode, htmlEncode, htmlDecode, processEncode } from './encode-logic';

describe('encode', () => {
  it('base64 encodes and decodes ASCII', () => {
    const encoded = base64Encode('Hello World');
    expect(encoded).toBe('SGVsbG8gV29ybGQ=');
    expect(base64Decode(encoded)).toBe('Hello World');
  });

  it('base64 handles UTF-8', () => {
    const text = 'こんにちは';
    const encoded = base64Encode(text);
    expect(base64Decode(encoded)).toBe(text);
  });

  it('url encodes special characters', () => {
    expect(urlEncode('hello world&foo=bar')).toBe('hello%20world%26foo%3Dbar');
  });

  it('url decodes', () => {
    expect(urlDecode('hello%20world')).toBe('hello world');
  });

  it('html encodes entities', () => {
    expect(htmlEncode('<div class="test">')).toBe('&lt;div class=&quot;test&quot;&gt;');
  });

  it('html decodes entities', () => {
    expect(htmlDecode('&lt;p&gt;')).toBe('<p>');
  });

  it('processEncode routes correctly', () => {
    expect(processEncode('test', 'url', 'encode')).toBe('test');
    expect(processEncode('%20', 'url', 'decode')).toBe(' ');
  });
});

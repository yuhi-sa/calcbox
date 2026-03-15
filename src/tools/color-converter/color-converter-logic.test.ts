import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, parseColor } from './color-converter-logic';

describe('color-converter', () => {
  it('converts hex to rgb', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts rgb to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#FF0000');
  });

  it('converts rgb to hsl', () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('converts hsl to rgb', () => {
    const rgb = hslToRgb({ h: 0, s: 100, l: 50 });
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('parses hex string', () => {
    const result = parseColor('#00FF00');
    expect(result.rgb).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('parses rgb string', () => {
    const result = parseColor('rgb(0, 0, 255)');
    expect(result.hex).toBe('#0000FF');
  });

  it('parses hsl string', () => {
    const result = parseColor('hsl(0, 100, 50)');
    expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('throws on invalid input', () => {
    expect(() => parseColor('invalid')).toThrow();
  });
});

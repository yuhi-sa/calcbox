import { describe, it, expect } from 'vitest';
import { generateGradientCss, parseGradientCss } from './gradient-logic';

describe('gradient', () => {
  it('generates linear gradient CSS', () => {
    const css = generateGradientCss('linear', [
      { color: '#ff0000', position: 0 },
      { color: '#0000ff', position: 100 },
    ], 'to right');
    expect(css).toBe('linear-gradient(to right, #ff0000 0%, #0000ff 100%)');
  });

  it('generates radial gradient CSS', () => {
    const css = generateGradientCss('radial', [
      { color: '#ff0000', position: 0 },
      { color: '#00ff00', position: 100 },
    ], '', 'circle');
    expect(css).toBe('radial-gradient(circle, #ff0000 0%, #00ff00 100%)');
  });

  it('sorts stops by position', () => {
    const css = generateGradientCss('linear', [
      { color: '#0000ff', position: 100 },
      { color: '#ff0000', position: 0 },
    ], '45deg');
    expect(css).toBe('linear-gradient(45deg, #ff0000 0%, #0000ff 100%)');
  });

  it('parses linear gradient CSS', () => {
    const result = parseGradientCss('linear-gradient(to right, #ff0000 0%, #0000ff 100%)');
    expect(result).not.toBeNull();
    expect(result!.type).toBe('linear');
    expect(result!.direction).toBe('to right');
    expect(result!.stops).toHaveLength(2);
  });

  it('returns null for invalid CSS', () => {
    expect(parseGradientCss('invalid')).toBeNull();
  });
});

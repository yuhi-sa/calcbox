import { describe, it, expect } from 'vitest';
import { calculateAspectRatio, calculateDimension, PRESETS } from './aspect-ratio-logic';

describe('Aspect Ratio calculations', () => {
  it('calculates 1920x1080 as 16:9', () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result.ratio).toBe('16:9');
    expect(result.simplifiedWidth).toBe(16);
    expect(result.simplifiedHeight).toBe(9);
  });

  it('calculates decimal ratio correctly', () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result.decimalRatio).toBeCloseTo(1.7778, 3);
  });

  it('calculates 1:1 for square dimensions', () => {
    const result = calculateAspectRatio(500, 500);
    expect(result.ratio).toBe('1:1');
  });

  it('calculates height from width and ratio', () => {
    const result = calculateDimension(16, 9, 1920, 'width');
    expect(result.width).toBe(1920);
    expect(result.height).toBe(1080);
  });

  it('calculates width from height and ratio', () => {
    const result = calculateDimension(16, 9, 1080, 'height');
    expect(result.width).toBe(1920);
    expect(result.height).toBe(1080);
  });

  it('has correct number of presets', () => {
    expect(PRESETS).toHaveLength(6);
  });

  it('calculates 4:3 ratio correctly', () => {
    const result = calculateAspectRatio(1024, 768);
    expect(result.ratio).toBe('4:3');
  });
});

import { describe, it, expect } from 'vitest';
import { calculatePaint } from './paint-calc-logic';

describe('Paint Calculator', () => {
  it('calculates wall area for a simple room with no doors or windows', () => {
    const result = calculatePaint({ width: 5, depth: 4, height: 2.5, doors: 0, windows: 0 });
    // 2*(5+4)*2.5 = 45
    expect(result.totalWallArea).toBe(45);
    expect(result.netWallArea).toBe(45);
  });

  it('subtracts door and window areas', () => {
    const result = calculatePaint({ width: 5, depth: 4, height: 2.5, doors: 1, windows: 2 });
    // doors: 1 * 0.8 * 2.0 = 1.6
    // windows: 2 * 0.9 * 1.2 = 2.16
    // net: 45 - 1.6 - 2.16 = 41.24
    expect(result.doorArea).toBe(1.6);
    expect(result.windowArea).toBe(2.16);
    expect(result.netWallArea).toBe(41.24);
  });

  it('calculates paint liters correctly', () => {
    const result = calculatePaint({ width: 5, depth: 4, height: 2.5, doors: 0, windows: 0 });
    // 45 / 10 = 4.5
    expect(result.paintLiters).toBe(4.5);
  });

  it('calculates wallpaper rolls with ceiling', () => {
    const result = calculatePaint({ width: 5, depth: 4, height: 2.5, doors: 0, windows: 0 });
    // roll area = 0.92 * 10 = 9.2m²
    // 45 / 9.2 = 4.89... => ceil = 5
    expect(result.wallpaperRolls).toBe(5);
  });

  it('net area does not go below zero', () => {
    const result = calculatePaint({ width: 1, depth: 1, height: 1, doors: 10, windows: 10 });
    expect(result.netWallArea).toBe(0);
    expect(result.paintLiters).toBe(0);
    expect(result.wallpaperRolls).toBe(0);
  });
});

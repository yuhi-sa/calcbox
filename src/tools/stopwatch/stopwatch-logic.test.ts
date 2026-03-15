import { describe, it, expect } from 'vitest';
import { formatElapsed, calculateLap } from './stopwatch-logic';

describe('Stopwatch logic', () => {
  it('formats elapsed time correctly', () => {
    expect(formatElapsed(0)).toBe('00:00.000');
    expect(formatElapsed(1500)).toBe('00:01.500');
    expect(formatElapsed(65432)).toBe('01:05.432');
    expect(formatElapsed(600000)).toBe('10:00.000');
  });

  it('calculates first lap correctly', () => {
    const lap = calculateLap(5000, []);
    expect(lap.lapNumber).toBe(1);
    expect(lap.lapTime).toBe(5000);
    expect(lap.cumulativeTime).toBe(5000);
    expect(lap.lapTimeFormatted).toBe('00:05.000');
  });

  it('calculates subsequent laps correctly', () => {
    const firstLap = calculateLap(5000, []);
    const secondLap = calculateLap(12500, [firstLap]);
    expect(secondLap.lapNumber).toBe(2);
    expect(secondLap.lapTime).toBe(7500);
    expect(secondLap.cumulativeTime).toBe(12500);
    expect(secondLap.lapTimeFormatted).toBe('00:07.500');
    expect(secondLap.cumulativeFormatted).toBe('00:12.500');
  });

  it('handles zero milliseconds', () => {
    expect(formatElapsed(0)).toBe('00:00.000');
  });

  it('handles large values', () => {
    expect(formatElapsed(3599999)).toBe('59:59.999');
  });
});

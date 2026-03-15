import { describe, it, expect } from 'vitest';
import { calculateCarInspection, addYears, diffDays } from './car-inspection-logic';

describe('Car Inspection calculations', () => {
  it('新車 first inspection is 3 years after registration', () => {
    const result = calculateCarInspection(
      { registrationDate: '2024-04-01', vehicleType: '新車' },
      '2024-04-01'
    );
    expect(result.nextInspectionDate).toBe('2027-04-01');
  });

  it('普通車 first inspection is 2 years after registration', () => {
    const result = calculateCarInspection(
      { registrationDate: '2024-04-01', vehicleType: '普通車' },
      '2024-04-01'
    );
    expect(result.nextInspectionDate).toBe('2026-04-01');
  });

  it('returns 3 upcoming inspections', () => {
    const result = calculateCarInspection(
      { registrationDate: '2020-01-01', vehicleType: '新車' },
      '2023-06-01'
    );
    expect(result.upcomingInspections).toHaveLength(3);
    expect(result.upcomingInspections[0].date).toBe('2025-01-01');
    expect(result.upcomingInspections[1].date).toBe('2027-01-01');
    expect(result.upcomingInspections[2].date).toBe('2029-01-01');
  });

  it('calculates correct days remaining', () => {
    const result = calculateCarInspection(
      { registrationDate: '2024-01-01', vehicleType: '新車' },
      '2026-12-01'
    );
    // Next inspection: 2027-01-01, days from 2026-12-01 = 31
    expect(result.daysRemaining).toBe(31);
  });

  it('addYears works correctly', () => {
    expect(addYears('2024-03-15', 3)).toBe('2027-03-15');
  });

  it('diffDays calculates day difference', () => {
    expect(diffDays('2024-01-01', '2024-01-31')).toBe(30);
  });
});

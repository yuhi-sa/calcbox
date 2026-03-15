import { describe, it, expect } from 'vitest';
import { calculateSavingsGoal } from './savings-goal-logic';

describe('Savings Goal calculations', () => {
  it('calculates months to goal with no interest', () => {
    const result = calculateSavingsGoal({
      goalAmount: 1000000,
      currentSavings: 0,
      monthlyDeposit: 100000,
      annualInterestRate: 0,
    });
    expect(result.monthsToGoal).toBe(10);
    expect(result.totalDeposited).toBe(1000000);
    expect(result.totalInterestEarned).toBe(0);
  });

  it('accounts for current savings', () => {
    const result = calculateSavingsGoal({
      goalAmount: 1000000,
      currentSavings: 500000,
      monthlyDeposit: 100000,
      annualInterestRate: 0,
    });
    expect(result.monthsToGoal).toBe(5);
    expect(result.totalDeposited).toBe(500000);
  });

  it('interest reduces months needed', () => {
    const withoutInterest = calculateSavingsGoal({
      goalAmount: 10000000,
      currentSavings: 0,
      monthlyDeposit: 50000,
      annualInterestRate: 0,
    });
    const withInterest = calculateSavingsGoal({
      goalAmount: 10000000,
      currentSavings: 0,
      monthlyDeposit: 50000,
      annualInterestRate: 10,
    });
    expect(withInterest.monthsToGoal).toBeLessThan(withoutInterest.monthsToGoal);
    expect(withInterest.totalInterestEarned).toBeGreaterThan(0);
  });

  it('returns progress data points', () => {
    const result = calculateSavingsGoal({
      goalAmount: 500000,
      currentSavings: 0,
      monthlyDeposit: 50000,
      annualInterestRate: 3,
    });
    expect(result.progressData.length).toBeGreaterThanOrEqual(2);
    expect(result.progressData[0].month).toBe(0);
    expect(result.progressData[0].balance).toBe(0);
  });

  it('calculates years correctly', () => {
    const result = calculateSavingsGoal({
      goalAmount: 1200000,
      currentSavings: 0,
      monthlyDeposit: 100000,
      annualInterestRate: 0,
    });
    expect(result.monthsToGoal).toBe(12);
    expect(result.yearsToGoal).toBe(1);
  });

  it('goal already reached returns 0 months', () => {
    const result = calculateSavingsGoal({
      goalAmount: 100000,
      currentSavings: 200000,
      monthlyDeposit: 10000,
      annualInterestRate: 5,
    });
    expect(result.monthsToGoal).toBe(0);
  });
});

export interface SavingsGoalInput {
  goalAmount: number;
  currentSavings: number;
  monthlyDeposit: number;
  annualInterestRate: number; // percentage, e.g. 3 for 3%
}

export interface SavingsGoalResult {
  monthsToGoal: number;
  yearsToGoal: number;
  totalDeposited: number;
  totalInterestEarned: number;
  finalAmount: number;
  progressData: ProgressDataPoint[];
}

export interface ProgressDataPoint {
  month: number;
  balance: number;
  deposits: number;
  interest: number;
}

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  const monthlyRate = input.annualInterestRate / 100 / 12;
  let balance = input.currentSavings;
  let totalDeposited = 0;
  let totalInterest = 0;
  let month = 0;
  const progressData: ProgressDataPoint[] = [];

  // Record initial state
  progressData.push({ month: 0, balance, deposits: 0, interest: 0 });

  const maxMonths = 12 * 100; // cap at 100 years

  while (balance < input.goalAmount && month < maxMonths) {
    month++;
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance += interest + input.monthlyDeposit;
    totalDeposited += input.monthlyDeposit;

    // Record data points at reasonable intervals
    if (month <= 12 || month % 12 === 0 || balance >= input.goalAmount) {
      progressData.push({
        month,
        balance: Math.round(balance),
        deposits: Math.round(input.currentSavings + totalDeposited),
        interest: Math.round(totalInterest),
      });
    }
  }

  return {
    monthsToGoal: month,
    yearsToGoal: Math.round((month / 12) * 10) / 10,
    totalDeposited: Math.round(totalDeposited),
    totalInterestEarned: Math.round(totalInterest),
    finalAmount: Math.round(balance),
    progressData,
  };
}

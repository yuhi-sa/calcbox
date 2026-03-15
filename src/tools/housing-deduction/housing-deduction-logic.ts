export type HouseType = 'general' | 'energy-efficient';

export interface YearlyDeduction {
  year: number;
  yearEndBalance: number;
  deduction: number;
}

export interface HousingDeductionResult {
  yearlyDeductions: YearlyDeduction[];
  totalDeduction: number;
  maxDeductionYears: number;
  balanceCap: number;
  houseTypeLabel: string;
}

function calcMonthlyPayment(principal: number, monthlyRate: number, totalMonths: number): number {
  if (monthlyRate === 0) return principal / totalMonths;
  const x = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * x) / (x - 1);
}

export function calcHousingDeduction(
  loanAmount: number,
  annualRate: number,
  loanTermYears: number,
  houseType: HouseType
): HousingDeductionResult {
  const deductionRate = 0.007; // 0.7% post-2024
  const maxYears = 13;
  const balanceCap = houseType === 'energy-efficient' ? 35000000 : 30000000;

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = loanTermYears * 12;
  const monthlyPayment = calcMonthlyPayment(loanAmount, monthlyRate, totalMonths);

  const yearlyDeductions: YearlyDeduction[] = [];
  let balance = loanAmount;
  let totalDeduction = 0;

  for (let y = 1; y <= maxYears; y++) {
    // Simulate 12 months of payments
    for (let m = 0; m < 12; m++) {
      if (balance <= 0) break;
      const interestPart = balance * monthlyRate;
      let principalPart = monthlyPayment - interestPart;
      if (principalPart > balance) principalPart = balance;
      balance -= principalPart;
    }

    const yearEndBalance = Math.max(0, balance);
    const applicableBalance = Math.min(yearEndBalance, balanceCap);
    const deduction = Math.floor(applicableBalance * deductionRate);

    yearlyDeductions.push({
      year: y,
      yearEndBalance: Math.round(yearEndBalance),
      deduction,
    });

    totalDeduction += deduction;
  }

  return {
    yearlyDeductions,
    totalDeduction,
    maxDeductionYears: maxYears,
    balanceCap,
    houseTypeLabel: houseType === 'energy-efficient' ? '省エネ住宅' : '一般住宅',
  };
}

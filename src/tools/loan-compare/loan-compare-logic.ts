export interface LoanInput {
  principal: number;
  annualRate: number;
  termYears: number;
}

export interface LoanCompareEntry {
  index: number;
  principal: number;
  annualRate: number;
  termYears: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  isBest: boolean;
}

export interface LoanCompareResult {
  entries: LoanCompareEntry[];
  bestIndex: number;
}

function calcMonthlyPayment(principal: number, monthlyRate: number, totalMonths: number): number {
  if (monthlyRate === 0) return principal / totalMonths;
  const x = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * x) / (x - 1);
}

export function calcLoanCompare(loans: LoanInput[]): LoanCompareResult {
  const entries: LoanCompareEntry[] = loans.map((loan, index) => {
    const monthlyRate = loan.annualRate / 100 / 12;
    const totalMonths = loan.termYears * 12;
    const monthlyPayment = calcMonthlyPayment(loan.principal, monthlyRate, totalMonths);
    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loan.principal;

    return {
      index,
      principal: loan.principal,
      annualRate: loan.annualRate,
      termYears: loan.termYears,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      isBest: false,
    };
  });

  // Find best option (lowest total payment)
  let bestIndex = 0;
  let minTotalPayment = Infinity;
  entries.forEach((e, i) => {
    if (e.totalPayment < minTotalPayment) {
      minTotalPayment = e.totalPayment;
      bestIndex = i;
    }
  });

  if (entries.length > 0) {
    entries[bestIndex].isBest = true;
  }

  return { entries, bestIndex };
}

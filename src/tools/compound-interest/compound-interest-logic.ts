export interface YearlyBreakdown {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export function calcCompoundInterest(
  initialAmount: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): CompoundInterestResult {
  const monthlyRate = annualRate / 100 / 12;
  const yearlyBreakdown: YearlyBreakdown[] = [];

  let balance = initialAmount;
  let totalContributions = initialAmount;
  let totalInterest = 0;

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate;
      yearInterest += interest;
      balance += interest + monthlyContribution;
    }
    totalContributions += monthlyContribution * 12;
    totalInterest += yearInterest;

    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance),
      contributions: Math.round(totalContributions),
      interest: Math.round(totalInterest),
    });
  }

  return {
    finalAmount: Math.round(balance),
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    yearlyBreakdown,
  };
}

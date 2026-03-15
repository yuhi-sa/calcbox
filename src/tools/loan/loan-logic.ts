export interface LoanResult {
  monthlyPayment: number;
  monthlyLabel: string;
  monthlyDisplay: string;
  totalPayment: number;
  totalInterest: number;
  yearlyData: YearlyData[];
  method: 'equal-payment' | 'equal-principal';
}

export interface YearlyData {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function formatYen(val: number): string {
  return Math.round(val).toLocaleString() + '円';
}

function calcEqualPayment(principal: number, monthlyRate: number, totalMonths: number): number {
  if (monthlyRate === 0) return principal / totalMonths;
  const x = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * x) / (x - 1);
}

export function calcLoan(
  amountMan: number,
  annualRate: number,
  years: number,
  method: 'equal-payment' | 'equal-principal'
): LoanResult {
  const principal = amountMan * 10000;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const yearlyData: YearlyData[] = [];

  if (method === 'equal-payment') {
    const monthlyPayment = calcEqualPayment(principal, monthlyRate, totalMonths);
    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - principal;

    let balance = principal;
    for (let y = 1; y <= years; y++) {
      let yearPrincipal = 0;
      let yearInterest = 0;
      for (let m = 0; m < 12; m++) {
        if (balance <= 0) break;
        const interestPart = balance * monthlyRate;
        let principalPart = monthlyPayment - interestPart;
        if (principalPart > balance) principalPart = balance;
        yearInterest += interestPart;
        yearPrincipal += principalPart;
        balance -= principalPart;
      }
      yearlyData.push({
        year: y,
        payment: yearPrincipal + yearInterest,
        principal: yearPrincipal,
        interest: yearInterest,
        balance: Math.max(0, balance),
      });
    }

    return {
      monthlyPayment,
      monthlyLabel: '毎月の返済額',
      monthlyDisplay: formatYen(monthlyPayment),
      totalPayment,
      totalInterest,
      yearlyData,
      method,
    };
  } else {
    const monthlyPrincipal = principal / totalMonths;
    const firstMonthPayment = monthlyPrincipal + principal * monthlyRate;
    const lastMonthPayment = monthlyPrincipal + monthlyPrincipal * monthlyRate;

    let totalPayment = 0;
    let totalInterest = 0;
    let balance = principal;

    for (let y = 1; y <= years; y++) {
      let yearPrincipalSum = 0;
      let yearInterestSum = 0;
      for (let m = 0; m < 12; m++) {
        if (balance <= 0) break;
        const interestPart = balance * monthlyRate;
        let principalPart = monthlyPrincipal;
        if (principalPart > balance) principalPart = balance;
        yearInterestSum += interestPart;
        yearPrincipalSum += principalPart;
        balance -= principalPart;
      }
      const yearPayment = yearPrincipalSum + yearInterestSum;
      totalPayment += yearPayment;
      totalInterest += yearInterestSum;
      yearlyData.push({
        year: y,
        payment: yearPayment,
        principal: yearPrincipalSum,
        interest: yearInterestSum,
        balance: Math.max(0, balance),
      });
    }

    return {
      monthlyPayment: firstMonthPayment,
      monthlyLabel: '初回の返済額（毎月変動）',
      monthlyDisplay: formatYen(firstMonthPayment) + ' 〜 ' + formatYen(lastMonthPayment),
      totalPayment,
      totalInterest,
      yearlyData,
      method,
    };
  }
}

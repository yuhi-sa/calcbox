export type RetirementType = '自己都合' | '会社都合' | '定年';

export interface RetirementPayResult {
  monthlySalary: number;
  yearsOfService: number;
  retirementType: RetirementType;
  coefficient: number;
  typeMultiplier: number;
  grossPay: number;
  taxDeduction: number;
  taxableIncome: number;
  estimatedTax: number;
  netPay: number;
  displayGross: string;
  displayNet: string;
}

/**
 * Get the service months coefficient based on years of service.
 * Uses midpoint of specified ranges.
 */
export function getCoefficient(years: number): number {
  if (years <= 0) return 0;
  if (years <= 3) return 0.75;   // 0.5-1.0 midpoint
  if (years <= 5) return 1.5;    // 1.0-2.0 midpoint
  if (years <= 10) return 4.0;   // 3.0-5.0 midpoint
  if (years <= 20) return 10.0;  // 8.0-12.0 midpoint
  if (years <= 30) return 17.5;  // 15.0-20.0 midpoint
  return 22.5;                   // 20.0-25.0 midpoint
}

export function getTypeMultiplier(type: RetirementType): number {
  if (type === '自己都合') return 0.6;
  return 1.0; // 会社都合 and 定年
}

/**
 * Calculate retirement income tax deduction (退職所得控除額)
 * - 20 years or less: 40万円 × years (min 80万円)
 * - Over 20 years: 800万円 + 70万円 × (years - 20)
 */
export function calcRetirementDeduction(years: number): number {
  if (years <= 0) return 0;
  if (years <= 20) {
    return Math.max(400000 * years, 800000);
  }
  return 8000000 + 700000 * (years - 20);
}

/**
 * Calculate estimated tax on retirement income.
 * Retirement income = (grossPay - deduction) × 1/2
 * Then apply progressive tax rates.
 */
export function calcRetirementTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  // Simplified progressive income tax rates
  let tax = 0;
  const brackets = [
    { limit: 1950000, rate: 0.05 },
    { limit: 3300000, rate: 0.10 },
    { limit: 6950000, rate: 0.20 },
    { limit: 9000000, rate: 0.23 },
    { limit: 18000000, rate: 0.33 },
    { limit: 40000000, rate: 0.40 },
    { limit: Infinity, rate: 0.45 },
  ];

  let remaining = taxableIncome;
  let prevLimit = 0;
  for (const b of brackets) {
    const bracketAmount = Math.min(remaining, b.limit - prevLimit);
    if (bracketAmount <= 0) break;
    tax += bracketAmount * b.rate;
    remaining -= bracketAmount;
    prevLimit = b.limit;
  }

  // Add 2.1% reconstruction special income tax
  tax = Math.floor(tax * 1.021);
  // Add approximate resident tax (10%)
  tax += Math.floor(taxableIncome * 0.10);

  return Math.floor(tax);
}

export function calculateRetirementPay(
  monthlySalary: number,
  yearsOfService: number,
  retirementType: RetirementType,
): RetirementPayResult {
  const coefficient = getCoefficient(yearsOfService);
  const typeMultiplier = getTypeMultiplier(retirementType);
  const grossPay = Math.floor(monthlySalary * coefficient * typeMultiplier);

  const taxDeduction = calcRetirementDeduction(yearsOfService);
  const halfIncome = Math.max(Math.floor((grossPay - taxDeduction) / 2), 0);
  const estimatedTax = calcRetirementTax(halfIncome);
  const netPay = grossPay - estimatedTax;

  return {
    monthlySalary,
    yearsOfService,
    retirementType,
    coefficient,
    typeMultiplier,
    grossPay,
    taxDeduction,
    taxableIncome: halfIncome,
    estimatedTax,
    netPay,
    displayGross: `${grossPay.toLocaleString()}円`,
    displayNet: `${netPay.toLocaleString()}円`,
  };
}

export type FamilyType = 'single' | 'married' | 'married_1child' | 'married_2children';

export interface FurusatoTaxResult {
  maxDeduction: number;
  selfBurden: number;
  effectiveBenefit: number;
  incomeLabel: string;
  familyLabel: string;
}

interface IncomeBracket {
  maxIncome: number;
  baseDeduction: number;
}

const INCOME_BRACKETS: IncomeBracket[] = [
  { maxIncome: 3000000, baseDeduction: 28000 },
  { maxIncome: 4000000, baseDeduction: 42000 },
  { maxIncome: 5000000, baseDeduction: 61000 },
  { maxIncome: 6000000, baseDeduction: 77000 },
  { maxIncome: 7000000, baseDeduction: 108000 },
  { maxIncome: 8000000, baseDeduction: 129000 },
  { maxIncome: 9000000, baseDeduction: 152000 },
  { maxIncome: 10000000, baseDeduction: 176000 },
  { maxIncome: 15000000, baseDeduction: 389000 },
  { maxIncome: 20000000, baseDeduction: 564000 },
];

const FAMILY_ADJUSTMENTS: Record<FamilyType, number> = {
  single: 1.0,
  married: 0.9,
  married_1child: 0.8,
  married_2children: 0.7,
};

const FAMILY_LABELS: Record<FamilyType, string> = {
  single: '独身',
  married: '夫婦（配偶者控除あり）',
  married_1child: '夫婦+子1人',
  married_2children: '夫婦+子2人',
};

export function getBaseDeduction(income: number): number {
  if (income <= 0) return 0;

  for (const bracket of INCOME_BRACKETS) {
    if (income <= bracket.maxIncome) {
      return bracket.baseDeduction;
    }
  }

  // Over 2000万 - extrapolate
  return Math.round(564000 * (income / 20000000));
}

export function calcFurusatoTax(
  annualIncome: number,
  familyType: FamilyType
): FurusatoTaxResult {
  const baseDeduction = getBaseDeduction(annualIncome);
  const adjustment = FAMILY_ADJUSTMENTS[familyType];
  const maxDeduction = Math.round(baseDeduction * adjustment);
  const selfBurden = 2000;
  const effectiveBenefit = Math.max(0, maxDeduction - selfBurden);

  return {
    maxDeduction,
    selfBurden,
    effectiveBenefit,
    incomeLabel: (annualIncome / 10000).toLocaleString() + '万円',
    familyLabel: FAMILY_LABELS[familyType],
  };
}

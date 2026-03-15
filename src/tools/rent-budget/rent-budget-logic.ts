export interface RentBudgetResult {
  monthlyIncome: number;
  recommendedMin: number;
  recommendedMax: number;
  utilitiesEstimate: number;
  warning: string | null;
}

const UTILITIES_ESTIMATE_RATIO = 0.05;

export function calculateRentBudget(
  income: number,
  isAnnual: boolean,
  includeBonus: boolean,
  bonusMonths: number = 2,
  currentRent?: number
): RentBudgetResult {
  let monthlyIncome: number;

  if (isAnnual) {
    if (includeBonus) {
      monthlyIncome = income / 12;
    } else {
      monthlyIncome = income / (12 + bonusMonths);
    }
  } else {
    monthlyIncome = income;
  }

  const recommendedMin = Math.round(monthlyIncome * 0.25);
  const recommendedMax = Math.round(monthlyIncome * 0.30);
  const utilitiesEstimate = Math.round(monthlyIncome * UTILITIES_ESTIMATE_RATIO);

  let warning: string | null = null;
  if (currentRent !== undefined && currentRent > monthlyIncome * 0.33) {
    warning = '現在の家賃が月収の33%を超えています。家計の見直しを検討してください。';
  }

  return {
    monthlyIncome: Math.round(monthlyIncome),
    recommendedMin,
    recommendedMax,
    utilitiesEstimate,
    warning,
  };
}

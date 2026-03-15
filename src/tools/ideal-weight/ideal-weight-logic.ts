export interface WeightTarget {
  label: string;
  bmiFactor: number;
  weight: number;
  diff: number;
  dailyCalorieDeficit: number | null;
}

export interface IdealWeightResult {
  targets: WeightTarget[];
  currentWeight: number;
  heightCm: number;
}

export function calcIdealWeight(heightCm: number, bmiFactor: number): number {
  const heightM = heightCm / 100;
  return heightM * heightM * bmiFactor;
}

export function calcDailyCalorieDeficit(weightDiffKg: number, months: number): number | null {
  if (weightDiffKg <= 0 || months <= 0) return null;
  const totalCalories = weightDiffKg * 7200;
  const days = months * 30;
  return totalCalories / days;
}

export function calculateIdealWeight(heightCm: number, currentWeight: number, targetMonths: number): IdealWeightResult {
  const definitions = [
    { label: '標準体重（BMI 22）', bmiFactor: 22 },
    { label: '美容体重（BMI 20）', bmiFactor: 20 },
    { label: 'モデル体重（BMI 18）', bmiFactor: 18 },
  ];

  const targets: WeightTarget[] = definitions.map((def) => {
    const weight = calcIdealWeight(heightCm, def.bmiFactor);
    const diff = currentWeight - weight;
    const dailyCalorieDeficit = calcDailyCalorieDeficit(diff, targetMonths);
    return { label: def.label, bmiFactor: def.bmiFactor, weight, diff, dailyCalorieDeficit };
  });

  return { targets, currentWeight, heightCm };
}

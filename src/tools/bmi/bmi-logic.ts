export interface BmiResult {
  bmi: number;
  category: { label: string; color: string };
  idealWeight: number;
  weightDiff: number;
}

export function calcBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'やせ（低体重）', color: '#3b82f6' };
  if (bmi < 25) return { label: '普通体重', color: '#22c55e' };
  if (bmi < 30) return { label: '肥満（1度）', color: '#f59e0b' };
  if (bmi < 35) return { label: '肥満（2度）', color: '#f97316' };
  if (bmi < 40) return { label: '肥満（3度）', color: '#ef4444' };
  return { label: '肥満（4度）', color: '#dc2626' };
}

export function getIdealWeight(heightCm: number): number {
  const heightM = heightCm / 100;
  return heightM * heightM * 22;
}

export function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  const bmi = calcBMI(heightCm, weightKg);
  const category = getCategory(bmi);
  const idealWeight = getIdealWeight(heightCm);
  const weightDiff = weightKg - idealWeight;
  return { bmi, category, idealWeight, weightDiff };
}

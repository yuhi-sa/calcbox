export type Gender = 'male' | 'female';

export interface BodyFatResult {
  bodyFatPercentage: number;
  category: { label: string; color: string };
  bmi: number;
}

export function calcBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function calcBodyFat(bmi: number, age: number, gender: Gender): number {
  const genderFactor = gender === 'male' ? 1 : 0;
  return 1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
}

export function getCategory(bodyFat: number, gender: Gender): { label: string; color: string } {
  if (gender === 'male') {
    if (bodyFat < 10) return { label: '低い', color: '#3b82f6' };
    if (bodyFat < 20) return { label: '標準', color: '#22c55e' };
    if (bodyFat < 25) return { label: '高い', color: '#f59e0b' };
    return { label: '非常に高い', color: '#ef4444' };
  } else {
    if (bodyFat < 20) return { label: '低い', color: '#3b82f6' };
    if (bodyFat < 30) return { label: '標準', color: '#22c55e' };
    if (bodyFat < 35) return { label: '高い', color: '#f59e0b' };
    return { label: '非常に高い', color: '#ef4444' };
  }
}

export function calculateBodyFat(heightCm: number, weightKg: number, age: number, gender: Gender): BodyFatResult {
  const bmi = calcBMI(heightCm, weightKg);
  const bodyFatPercentage = calcBodyFat(bmi, age, gender);
  const category = getCategory(bodyFatPercentage, gender);
  return { bodyFatPercentage, category, bmi };
}

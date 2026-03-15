export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export const ACTIVITY_LEVELS: { key: ActivityLevel; label: string; factor: number }[] = [
  { key: 'sedentary', label: 'ほとんど運動しない', factor: 1.2 },
  { key: 'light', label: '軽い運動（週1〜3日）', factor: 1.375 },
  { key: 'moderate', label: '適度な運動（週3〜5日）', factor: 1.55 },
  { key: 'active', label: '激しい運動（週6〜7日）', factor: 1.725 },
  { key: 'very_active', label: '非常に激しい運動', factor: 1.9 },
];

export interface BmrResult {
  bmr: number;
  tdee: number;
  activityLevel: string;
}

export function calcBMR(gender: Gender, age: number, heightCm: number, weightKg: number): number {
  if (gender === 'male') {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;
}

export function calcTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const level = ACTIVITY_LEVELS.find((l) => l.key === activityLevel);
  return bmr * (level?.factor ?? 1.2);
}

export function calculateBmr(gender: Gender, age: number, heightCm: number, weightKg: number, activityLevel: ActivityLevel): BmrResult {
  const bmr = calcBMR(gender, age, heightCm, weightKg);
  const tdee = calcTDEE(bmr, activityLevel);
  const level = ACTIVITY_LEVELS.find((l) => l.key === activityLevel);
  return { bmr, tdee, activityLevel: level?.label ?? '' };
}

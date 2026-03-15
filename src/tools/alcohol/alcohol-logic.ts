export interface DrinkPreset {
  name: string;
  percentage: number;
}

export const DRINK_PRESETS: DrinkPreset[] = [
  { name: 'ビール', percentage: 5 },
  { name: 'ワイン', percentage: 12 },
  { name: '日本酒', percentage: 15 },
  { name: '焼酎', percentage: 25 },
  { name: 'ウイスキー', percentage: 40 },
  { name: 'ハイボール', percentage: 7 },
  { name: 'カスタム', percentage: 0 },
];

export interface AlcoholResult {
  pureAlcoholGrams: number;
  decompositionTimeHours: number;
  soberTime: Date;
  decompositionRatePerHour: number;
}

export function calcPureAlcohol(volumeMl: number, percentage: number): number {
  return volumeMl * (percentage / 100) * 0.8;
}

export function calcDecompositionRate(weightKg: number): number {
  return weightKg * 0.1;
}

export function calcDecompositionTime(pureAlcoholGrams: number, ratePerHour: number): number {
  if (ratePerHour <= 0) return 0;
  return pureAlcoholGrams / ratePerHour;
}

export function calculateAlcohol(volumeMl: number, percentage: number, weightKg: number, now: Date): AlcoholResult {
  const pureAlcoholGrams = calcPureAlcohol(volumeMl, percentage);
  const decompositionRatePerHour = calcDecompositionRate(weightKg);
  const decompositionTimeHours = calcDecompositionTime(pureAlcoholGrams, decompositionRatePerHour);
  const soberTime = new Date(now.getTime() + decompositionTimeHours * 60 * 60 * 1000);
  return { pureAlcoholGrams, decompositionTimeHours, soberTime, decompositionRatePerHour };
}

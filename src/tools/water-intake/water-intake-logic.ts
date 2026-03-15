export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Climate = 'cool' | 'temperate' | 'warm' | 'hot';

export interface WaterIntakeInput {
  weightKg: number;
  activityLevel: ActivityLevel;
  climate: Climate;
}

export interface WaterIntakeResult {
  dailyMl: number;
  dailyCups: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  climate: Climate;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.2,
  active: 1.4,
  very_active: 1.6,
};

const CLIMATE_MULTIPLIERS: Record<Climate, number> = {
  cool: 0.9,
  temperate: 1.0,
  warm: 1.1,
  hot: 1.3,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'ほぼ運動しない',
  light: '軽い運動',
  moderate: '中程度の運動',
  active: '活発な運動',
  very_active: '非常に活発',
};

export const CLIMATE_LABELS: Record<Climate, string> = {
  cool: '涼しい / 冬',
  temperate: '快適 / 春秋',
  warm: '暖かい / 初夏',
  hot: '暑い / 真夏',
};

export function calculateWaterIntake(input: WaterIntakeInput): WaterIntakeResult {
  const baseMl = input.weightKg * 35;
  const activityMultiplier = ACTIVITY_MULTIPLIERS[input.activityLevel];
  const climateMultiplier = CLIMATE_MULTIPLIERS[input.climate];
  const dailyMl = Math.round(baseMl * activityMultiplier * climateMultiplier);
  const dailyCups = Math.round((dailyMl / 200) * 10) / 10;

  return {
    dailyMl,
    dailyCups,
    weightKg: input.weightKg,
    activityLevel: input.activityLevel,
    climate: input.climate,
  };
}

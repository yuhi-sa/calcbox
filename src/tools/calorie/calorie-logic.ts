export interface Activity {
  name: string;
  met: number;
}

export const ACTIVITIES: Activity[] = [
  { name: 'ウォーキング', met: 3.5 },
  { name: 'ジョギング', met: 7.0 },
  { name: 'ランニング', met: 10.0 },
  { name: 'サイクリング', met: 6.8 },
  { name: '水泳', met: 8.0 },
  { name: 'ヨガ', met: 2.5 },
  { name: '筋トレ', met: 6.0 },
  { name: 'デスクワーク', met: 1.5 },
];

export interface CalorieResult {
  calories: number;
  activity: string;
  met: number;
  durationMinutes: number;
}

export function calcCalories(met: number, weightKg: number, durationMinutes: number): number {
  const hours = durationMinutes / 60;
  return met * weightKg * hours * 1.05;
}

export function calculateCalorie(activityIndex: number, weightKg: number, durationMinutes: number): CalorieResult {
  const activity = ACTIVITIES[activityIndex];
  const calories = calcCalories(activity.met, weightKg, durationMinutes);
  return { calories, activity: activity.name, met: activity.met, durationMinutes };
}

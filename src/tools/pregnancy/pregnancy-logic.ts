export interface PregnancyResult {
  currentWeeks: number;
  currentDays: number;
  dueDate: Date;
  trimester: string;
  daysRemaining: number;
  totalDaysElapsed: number;
}

export function calcDueDate(lastPeriodDate: Date): Date {
  const due = new Date(lastPeriodDate);
  due.setDate(due.getDate() + 280);
  return due;
}

export function calcWeeks(lastPeriodDate: Date, today: Date): { weeks: number; days: number; totalDays: number } {
  const diffMs = today.getTime() - lastPeriodDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return { weeks, days, totalDays };
}

export function getTrimester(weeks: number): string {
  if (weeks < 14) return '初期（第1三半期）';
  if (weeks < 28) return '中期（第2三半期）';
  return '後期（第3三半期）';
}

export function calculatePregnancy(lastPeriodDate: Date, today: Date): PregnancyResult {
  const dueDate = calcDueDate(lastPeriodDate);
  const { weeks, days, totalDays } = calcWeeks(lastPeriodDate, today);
  const trimester = getTrimester(weeks);
  const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  return {
    currentWeeks: weeks,
    currentDays: days,
    dueDate,
    trimester,
    daysRemaining,
    totalDaysElapsed: totalDays,
  };
}

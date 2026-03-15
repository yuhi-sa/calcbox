export interface DateDiffResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

export interface AddDaysResult {
  resultDate: Date;
  formatted: string;
}

export function dateDiff(start: Date, end: Date): DateDiffResult {
  const diffMs = end.getTime() - start.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const weeks = days / 7;

  // Approximate months and years
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();

  let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  // Adjust if end day < start day
  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  const years = months / 12;

  return {
    days: Math.abs(days),
    weeks: Math.abs(weeks),
    months: Math.abs(months),
    years: Math.abs(years),
  };
}

export function addDays(start: Date, days: number): AddDaysResult {
  const resultDate = new Date(start);
  resultDate.setDate(resultDate.getDate() + days);

  const formatted = formatDate(resultDate);
  return { resultDate, formatted };
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const dayOfWeek = dayNames[date.getDay()];
  return `${y}年${m}月${d}日（${dayOfWeek}）`;
}

export function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error('無効な日付です');
  return date;
}

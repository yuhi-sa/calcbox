export interface DateFormats {
  iso8601: string;
  yyyymmdd: string;
  ddmmyyyy: string;
  mmddyyyy: string;
  japanese: string;
  japaneseFull: string;
  rfc2822: string;
  unixTimestamp: number;
  relative: string;
  dayOfWeek: string;
  dayOfWeekJa: string;
}

const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const daysJa = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];

export function parseDate(input: string): Date | null {
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function formatDate(date: Date): DateFormats {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');

  return {
    iso8601: date.toISOString(),
    yyyymmdd: `${y}-${mm}-${dd}`,
    ddmmyyyy: `${dd}/${mm}/${y}`,
    mmddyyyy: `${mm}/${dd}/${y}`,
    japanese: `${y}年${m}月${d}日`,
    japaneseFull: `${y}年${m}月${d}日（${daysJa[date.getDay()]}）`,
    rfc2822: date.toUTCString(),
    unixTimestamp: Math.floor(date.getTime() / 1000),
    relative: getRelativeTime(date),
    dayOfWeek: daysEn[date.getDay()],
    dayOfWeekJa: daysJa[date.getDay()],
  };
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '明日';
  if (diffDays === -1) return '昨日';
  if (diffDays > 0) return `${diffDays}日後`;
  return `${Math.abs(diffDays)}日前`;
}

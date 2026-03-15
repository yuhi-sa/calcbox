export interface TimezoneInfo {
  id: string;
  label: string;
  offset: number; // hours from UTC
}

export const TIMEZONES: TimezoneInfo[] = [
  { id: 'JST', label: 'JST（日本標準時）', offset: 9 },
  { id: 'UTC', label: 'UTC（協定世界時）', offset: 0 },
  { id: 'EST', label: 'EST（米国東部）', offset: -5 },
  { id: 'CST', label: 'CST（米国中部）', offset: -6 },
  { id: 'PST', label: 'PST（米国太平洋）', offset: -8 },
  { id: 'CET', label: 'CET（中央ヨーロッパ）', offset: 1 },
  { id: 'IST', label: 'IST（インド）', offset: 5.5 },
  { id: 'CST_CN', label: 'CST（中国）', offset: 8 },
  { id: 'AEST', label: 'AEST（オーストラリア東部）', offset: 10 },
  { id: 'GMT', label: 'GMT（グリニッジ）', offset: 0 },
];

export interface ConvertedTime {
  hours: number;
  minutes: number;
  formatted: string;
  dateChange: number; // -1, 0, or 1
  dateChangeLabel: string;
}

export function convertTimezone(
  hours: number,
  minutes: number,
  sourceId: string,
  targetId: string
): ConvertedTime | null {
  const source = TIMEZONES.find((t) => t.id === sourceId);
  const target = TIMEZONES.find((t) => t.id === targetId);
  if (!source || !target) return null;

  const diffHours = target.offset - source.offset;
  let totalMinutes = hours * 60 + minutes + diffHours * 60;

  let dateChange = 0;
  if (totalMinutes < 0) {
    dateChange = -1;
    totalMinutes += 24 * 60;
  } else if (totalMinutes >= 24 * 60) {
    dateChange = 1;
    totalMinutes -= 24 * 60;
  }

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  let dateChangeLabel = '';
  if (dateChange === 1) dateChangeLabel = '翌日';
  else if (dateChange === -1) dateChangeLabel = '前日';

  return {
    hours: h,
    minutes: m,
    formatted: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
    dateChange,
    dateChangeLabel,
  };
}

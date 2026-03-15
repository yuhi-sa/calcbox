export interface TimeValue {
  hours: number;
  minutes: number;
}

export interface TimeResult {
  hours: number;
  minutes: number;
  formatted: string;
}

export function parseTime(timeStr: string): TimeValue | null {
  const match = timeStr.match(/^(\d{1,3}):(\d{2})$/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (minutes < 0 || minutes >= 60) return null;
  return { hours, minutes };
}

export function formatTime(hours: number, minutes: number): string {
  const sign = hours < 0 || (hours === 0 && minutes < 0) ? '-' : '';
  const h = Math.abs(hours);
  const m = Math.abs(minutes);
  return `${sign}${h}:${m.toString().padStart(2, '0')}`;
}

export function addTimes(t1: TimeValue, t2: TimeValue): TimeResult {
  const totalMinutes = t1.hours * 60 + t1.minutes + t2.hours * 60 + t2.minutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, formatted: formatTime(hours, minutes) };
}

export function subtractTimes(t1: TimeValue, t2: TimeValue): TimeResult {
  let totalMinutes = (t1.hours * 60 + t1.minutes) - (t2.hours * 60 + t2.minutes);
  const negative = totalMinutes < 0;
  totalMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(totalMinutes / 60) * (negative ? -1 : 1);
  const minutes = totalMinutes % 60;
  return { hours, minutes, formatted: formatTime(hours, minutes) };
}

export function timeDifference(t1: TimeValue, t2: TimeValue): TimeResult {
  const diffMinutes = Math.abs((t1.hours * 60 + t1.minutes) - (t2.hours * 60 + t2.minutes));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return { hours, minutes, formatted: formatTime(hours, minutes) };
}

export function minutesToHours(totalMinutes: number): TimeResult {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, formatted: formatTime(hours, minutes) };
}

export function hoursToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes;
}

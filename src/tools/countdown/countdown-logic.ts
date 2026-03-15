export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
}

export function calculateCountdown(now: Date, target: Date): CountdownResult {
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds, isExpired: false };
}

export function formatCountdown(result: CountdownResult): string {
  if (result.isExpired) return '終了';
  const parts: string[] = [];
  if (result.days > 0) parts.push(`${result.days}日`);
  parts.push(`${result.hours.toString().padStart(2, '0')}:${result.minutes.toString().padStart(2, '0')}:${result.seconds.toString().padStart(2, '0')}`);
  return parts.join(' ');
}

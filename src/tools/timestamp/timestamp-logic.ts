function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

export function formatDate(date: Date): string {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

export function timestampToDate(timestamp: number, unit: 's' | 'ms'): Date | null {
  const ms = unit === 'ms' ? timestamp : timestamp * 1000;
  const date = new Date(ms);
  return isNaN(date.getTime()) ? null : date;
}

export function dateToTimestamp(date: Date): { seconds: number; milliseconds: number } {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime(),
  };
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function getLocalISOString(date: Date): string {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

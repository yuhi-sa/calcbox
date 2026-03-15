export interface CronParseResult {
  description: string;
  nextExecutions: string[];
  valid: boolean;
  error?: string;
}

export const CRON_PRESETS = [
  { label: '毎分', value: '* * * * *' },
  { label: '毎時', value: '0 * * * *' },
  { label: '毎日 0:00', value: '0 0 * * *' },
  { label: '毎週月曜 0:00', value: '0 0 * * 1' },
  { label: '毎月1日 0:00', value: '0 0 1 * *' },
] as const;

const DOW_NAMES = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];
const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function describeField(field: string, unit: string): string {
  if (field === '*') return `毎${unit}`;
  if (field.includes('/')) {
    const [, step] = field.split('/');
    return `${step}${unit}ごと`;
  }
  if (field.includes(',')) return `${unit} ${field}`;
  if (field.includes('-')) {
    const [start, end] = field.split('-');
    return `${unit} ${start}〜${end}`;
  }
  return `${unit} ${field}`;
}

export function describeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return '無効なCron式です（5フィールド必要）';

  const [min, hour, dom, month, dow] = parts;

  if (expression.trim() === '* * * * *') return '毎分実行';
  if (min === '0' && hour === '*' && dom === '*' && month === '*' && dow === '*') return '毎時0分に実行';
  if (min === '0' && hour === '0' && dom === '*' && month === '*' && dow === '*') return '毎日 0:00 に実行';

  const descriptions: string[] = [];

  if (dow !== '*') {
    const dowNum = parseInt(dow);
    if (!isNaN(dowNum) && dowNum >= 0 && dowNum <= 6) {
      descriptions.push(`${DOW_NAMES[dowNum]}の`);
    } else {
      descriptions.push(describeField(dow, '曜日') + 'の');
    }
  }

  if (month !== '*') {
    const monthNum = parseInt(month);
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      descriptions.push(`${MONTH_NAMES[monthNum]}の`);
    } else {
      descriptions.push(describeField(month, '月') + 'の');
    }
  }

  if (dom !== '*') descriptions.push(describeField(dom, '日') + 'の');
  if (hour !== '*') descriptions.push(describeField(hour, '時'));
  if (min !== '*') descriptions.push(describeField(min, '分'));

  descriptions.push('に実行');
  return descriptions.join('');
}

function matchesField(field: string, value: number): boolean {
  if (field === '*') return true;
  if (field.includes('/')) {
    const [base, step] = field.split('/');
    const stepNum = parseInt(step);
    const baseNum = base === '*' ? 0 : parseInt(base);
    return (value - baseNum) % stepNum === 0 && value >= baseNum;
  }
  if (field.includes(',')) {
    return field.split(',').map(Number).includes(value);
  }
  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number);
    return value >= start && value <= end;
  }
  return parseInt(field) === value;
}

export function getNextExecutions(expression: string, count: number = 5, from?: Date): string[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minF, hourF, domF, monthF, dowF] = parts;
  const results: string[] = [];
  const date = from ? new Date(from) : new Date();
  date.setSeconds(0);
  date.setMilliseconds(0);
  date.setMinutes(date.getMinutes() + 1);

  const maxIterations = 525600; // 1 year of minutes
  for (let i = 0; i < maxIterations && results.length < count; i++) {
    if (
      matchesField(minF, date.getMinutes()) &&
      matchesField(hourF, date.getHours()) &&
      matchesField(domF, date.getDate()) &&
      matchesField(monthF, date.getMonth() + 1) &&
      matchesField(dowF, date.getDay())
    ) {
      results.push(date.toLocaleString('ja-JP'));
    }
    date.setMinutes(date.getMinutes() + 1);
  }

  return results;
}

export function parseCron(expression: string, count: number = 5): CronParseResult {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { description: '', nextExecutions: [], valid: false, error: '5フィールドのCron式を入力してください' };
  }

  return {
    description: describeCron(expression),
    nextExecutions: getNextExecutions(expression, count),
    valid: true,
  };
}

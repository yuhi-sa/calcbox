export interface OvertimeInput {
  mode: 'hourly' | 'monthly';
  hourlyRate?: number;
  monthlySalary?: number;
  monthlyHours?: number;
  normalHours: number;
  lateNightHours: number;
  holidayHours: number;
  holidayLateNightHours: number;
}

export interface OvertimeResult {
  baseHourlyRate: number;
  normalOvertimePay: number;
  lateNightPay: number;
  holidayPay: number;
  holidayLateNightPay: number;
  totalOvertimePay: number;
  details: OvertimeDetail[];
}

export interface OvertimeDetail {
  label: string;
  hours: number;
  rate: number;
  hourlyAmount: number;
  subtotal: number;
}

/** Japanese labor law overtime rates */
export const RATES = {
  normal: 1.25,
  lateNight: 1.50,
  holiday: 1.35,
  holidayLateNight: 1.60,
};

export function getBaseHourlyRate(input: OvertimeInput): number {
  if (input.mode === 'hourly') {
    return input.hourlyRate ?? 0;
  }
  const salary = input.monthlySalary ?? 0;
  const hours = input.monthlyHours ?? 160;
  if (hours === 0) return 0;
  return salary / hours;
}

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const baseHourlyRate = getBaseHourlyRate(input);

  const details: OvertimeDetail[] = [];

  const normalRate = baseHourlyRate * RATES.normal;
  const normalPay = normalRate * input.normalHours;
  details.push({
    label: '通常残業（125%）',
    hours: input.normalHours,
    rate: RATES.normal,
    hourlyAmount: normalRate,
    subtotal: normalPay,
  });

  const lateNightRate = baseHourlyRate * RATES.lateNight;
  const lateNightPay = lateNightRate * input.lateNightHours;
  details.push({
    label: '深夜残業（150%）',
    hours: input.lateNightHours,
    rate: RATES.lateNight,
    hourlyAmount: lateNightRate,
    subtotal: lateNightPay,
  });

  const holidayRate = baseHourlyRate * RATES.holiday;
  const holidayPay = holidayRate * input.holidayHours;
  details.push({
    label: '休日残業（135%）',
    hours: input.holidayHours,
    rate: RATES.holiday,
    hourlyAmount: holidayRate,
    subtotal: holidayPay,
  });

  const holidayLateNightRate = baseHourlyRate * RATES.holidayLateNight;
  const holidayLateNightPay = holidayLateNightRate * input.holidayLateNightHours;
  details.push({
    label: '休日深夜残業（160%）',
    hours: input.holidayLateNightHours,
    rate: RATES.holidayLateNight,
    hourlyAmount: holidayLateNightRate,
    subtotal: holidayLateNightPay,
  });

  return {
    baseHourlyRate,
    normalOvertimePay: normalPay,
    lateNightPay,
    holidayPay,
    holidayLateNightPay,
    totalOvertimePay: normalPay + lateNightPay + holidayPay + holidayLateNightPay,
    details,
  };
}

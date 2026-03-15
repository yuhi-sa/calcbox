export type ShiftBasis = 'weekly' | 'monthly';

export interface WallWarning {
  wall: string;
  amount: number;
  exceeded: boolean;
  message: string;
}

export interface PartTimePayResult {
  dailyPay: number;
  weeklyPay: number;
  monthlyPay: number;
  yearlyPay: number;
  warnings: WallWarning[];
}

const WALLS = [
  { wall: '103万円の壁', amount: 1030000, message: '所得税が発生します' },
  { wall: '106万円の壁', amount: 1060000, message: '社会保険加入の可能性があります（従業員51人以上の企業）' },
  { wall: '130万円の壁', amount: 1300000, message: '社会保険の扶養から外れます' },
];

export function calcPartTimePay(
  hourlyRate: number,
  hoursPerShift: number,
  shiftsCount: number,
  shiftBasis: ShiftBasis
): PartTimePayResult {
  const dailyPay = hourlyRate * hoursPerShift;

  let monthlyShifts: number;
  let weeklyPay: number;

  if (shiftBasis === 'weekly') {
    weeklyPay = dailyPay * shiftsCount;
    monthlyShifts = shiftsCount * (52 / 12); // average weeks per month
  } else {
    monthlyShifts = shiftsCount;
    weeklyPay = dailyPay * (shiftsCount * 12 / 52);
  }

  const monthlyPay = Math.round(dailyPay * monthlyShifts);
  const yearlyPay = monthlyPay * 12;

  const warnings: WallWarning[] = WALLS.map((w) => ({
    wall: w.wall,
    amount: w.amount,
    exceeded: yearlyPay > w.amount,
    message: w.message,
  }));

  return {
    dailyPay: Math.round(dailyPay),
    weeklyPay: Math.round(weeklyPay),
    monthlyPay,
    yearlyPay,
    warnings,
  };
}

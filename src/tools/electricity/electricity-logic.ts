export interface ElectricityResult {
  dailyKwh: number;
  monthlyKwh: number;
  yearlyKwh: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
}

export const DEFAULT_UNIT_PRICE = 31;

export function calcElectricity(
  wattage: number,
  hoursPerDay: number,
  unitPrice: number = DEFAULT_UNIT_PRICE
): ElectricityResult {
  if (wattage < 0) throw new Error('消費電力は0以上にしてください');
  if (hoursPerDay < 0 || hoursPerDay > 24) throw new Error('使用時間は0〜24時間にしてください');
  if (unitPrice < 0) throw new Error('電気料金単価は0以上にしてください');

  const dailyKwh = (wattage / 1000) * hoursPerDay;
  const monthlyKwh = dailyKwh * 30;
  const yearlyKwh = monthlyKwh * 12;

  const dailyCost = dailyKwh * unitPrice;
  const monthlyCost = monthlyKwh * unitPrice;
  const yearlyCost = yearlyKwh * unitPrice;

  return { dailyKwh, monthlyKwh, yearlyKwh, dailyCost, monthlyCost, yearlyCost };
}

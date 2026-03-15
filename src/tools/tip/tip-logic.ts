export interface TipResult {
  tipAmount: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}

export function calculateTip(
  billAmount: number,
  tipPercent: number,
  numPeople: number
): TipResult {
  const people = Math.max(1, Math.round(numPeople));
  const tipAmount = billAmount * (tipPercent / 100);
  const total = billAmount + tipAmount;
  const perPerson = total / people;
  const tipPerPerson = tipAmount / people;
  return { tipAmount, total, perPerson, tipPerPerson };
}

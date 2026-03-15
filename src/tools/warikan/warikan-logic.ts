export type RoundingMethod = 'floor' | 'ceil' | 'round';

export interface WarikanResult {
  perPerson: number;
  remainder: number;
  total: number;
  people: number;
}

export interface WeightedWarikanResult {
  amounts: number[];
  remainder: number;
  total: number;
}

export function roundAmount(amount: number, method: RoundingMethod): number {
  switch (method) {
    case 'floor':
      return Math.floor(amount);
    case 'ceil':
      return Math.ceil(amount);
    case 'round':
      return Math.round(amount);
  }
}

export function calcWarikan(
  total: number,
  people: number,
  method: RoundingMethod = 'floor'
): WarikanResult {
  if (people <= 0) throw new Error('人数は1以上にしてください');
  if (total < 0) throw new Error('合計金額は0以上にしてください');

  const perPerson = roundAmount(total / people, method);
  const remainder = total - perPerson * people;

  return { perPerson, remainder, total, people };
}

export function calcWeightedWarikan(
  total: number,
  weights: number[],
  method: RoundingMethod = 'floor'
): WeightedWarikanResult {
  if (weights.length === 0) throw new Error('人数は1以上にしてください');
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) throw new Error('重みの合計は0より大きくしてください');

  const amounts = weights.map((w) => roundAmount((total * w) / totalWeight, method));
  const sumAmounts = amounts.reduce((a, b) => a + b, 0);
  const remainder = total - sumAmounts;

  return { amounts, remainder, total };
}

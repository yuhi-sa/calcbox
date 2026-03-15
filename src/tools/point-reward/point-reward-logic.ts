export interface PointRewardResult {
  pointsEarned: number;
  effectiveDiscount: number;
  effectivePrice: number;
  rewardRate: number;
}

export function calcPointReward(
  purchaseAmount: number,
  rewardRate: number,
  pointValue: number = 1
): PointRewardResult {
  const pointsEarned = Math.floor(purchaseAmount * (rewardRate / 100));
  const effectiveDiscount = Math.round(pointsEarned * pointValue);
  const effectivePrice = purchaseAmount - effectiveDiscount;

  return {
    pointsEarned,
    effectiveDiscount,
    effectivePrice,
    rewardRate,
  };
}

export interface ComparisonEntry {
  name: string;
  purchaseAmount: number;
  rewardRate: number;
  pointValue: number;
  result: PointRewardResult;
}

export function comparePointRewards(
  purchaseAmount: number,
  entries: { name: string; rewardRate: number; pointValue: number }[]
): ComparisonEntry[] {
  return entries.map((e) => ({
    name: e.name,
    purchaseAmount,
    rewardRate: e.rewardRate,
    pointValue: e.pointValue,
    result: calcPointReward(purchaseAmount, e.rewardRate, e.pointValue),
  }));
}

export type HouseholdSize = '1人' | '2人' | '3人' | '4人+';
export type Season = '通常期' | '繁忙期';

export interface MovingCostBreakdown {
  baseCost: number;
  distanceSurcharge: number;
  seasonMultiplier: number;
  totalCost: number;
}

const BASE_PRICES: Record<HouseholdSize, number> = {
  '1人': 30000,
  '2人': 60000,
  '3人': 80000,
  '4人+': 100000,
};

const DISTANCE_THRESHOLD_KM = 20;
const DISTANCE_SURCHARGE_PER_KM = 500;

export function calculateMovingCost(
  distanceKm: number,
  householdSize: HouseholdSize,
  season: Season
): MovingCostBreakdown {
  const baseCost = BASE_PRICES[householdSize];
  const extraDistance = Math.max(0, distanceKm - DISTANCE_THRESHOLD_KM);
  const distanceSurcharge = extraDistance * DISTANCE_SURCHARGE_PER_KM;
  const seasonMultiplier = season === '繁忙期' ? 1.5 : 1.0;
  const totalCost = Math.round((baseCost + distanceSurcharge) * seasonMultiplier);

  return {
    baseCost,
    distanceSurcharge,
    seasonMultiplier,
    totalCost,
  };
}

export interface FuelCostResult {
  fuelNeeded: number;
  totalCost: number;
  costPerKm: number;
}

export interface FuelBudgetResult {
  maxDistance: number;
  fuelUsable: number;
}

export function calculateFuelCost(
  distanceKm: number,
  fuelEfficiency: number,
  fuelPrice: number
): FuelCostResult {
  const fuelNeeded = distanceKm / fuelEfficiency;
  const totalCost = fuelNeeded * fuelPrice;
  const costPerKm = totalCost / distanceKm;
  return {
    fuelNeeded: Math.round(fuelNeeded * 100) / 100,
    totalCost: Math.round(totalCost),
    costPerKm: Math.round(costPerKm * 100) / 100,
  };
}

export function calculateDistanceFromBudget(
  budget: number,
  fuelEfficiency: number,
  fuelPrice: number
): FuelBudgetResult {
  const fuelUsable = budget / fuelPrice;
  const maxDistance = fuelUsable * fuelEfficiency;
  return {
    maxDistance: Math.round(maxDistance * 100) / 100,
    fuelUsable: Math.round(fuelUsable * 100) / 100,
  };
}

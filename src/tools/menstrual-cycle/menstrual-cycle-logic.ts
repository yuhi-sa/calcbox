export interface CyclePrediction {
  periodStart: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export interface MenstrualCycleResult {
  nextCycles: CyclePrediction[];
  cycleLength: number;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function calculateCycles(
  lastPeriodStart: Date,
  cycleLength: number = 28,
  numberOfCycles: number = 3
): MenstrualCycleResult {
  const nextCycles: CyclePrediction[] = [];

  for (let i = 1; i <= numberOfCycles; i++) {
    const periodStart = addDays(lastPeriodStart, cycleLength * i);
    const ovulationDate = addDays(periodStart, -(14));
    const fertileWindowStart = addDays(ovulationDate, -2);
    const fertileWindowEnd = addDays(ovulationDate, 2);

    nextCycles.push({
      periodStart,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd,
    });
  }

  return { nextCycles, cycleLength };
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

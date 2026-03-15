export interface HeartRateZone {
  name: string;
  nameJa: string;
  minBpm: number;
  maxBpm: number;
  minPercent: number;
  maxPercent: number;
}

export interface HeartRateInput {
  age: number;
  restingHeartRate?: number;
}

export interface HeartRateResult {
  maxHeartRate: number;
  method: 'standard' | 'karvonen';
  zones: HeartRateZone[];
}

const ZONE_DEFINITIONS = [
  { name: 'Recovery', nameJa: '回復', minPercent: 50, maxPercent: 60 },
  { name: 'Fat Burn', nameJa: '脂肪燃焼', minPercent: 60, maxPercent: 70 },
  { name: 'Cardio', nameJa: '有酸素', minPercent: 70, maxPercent: 80 },
  { name: 'Threshold', nameJa: '閾値', minPercent: 80, maxPercent: 90 },
  { name: 'VO2max', nameJa: '最大酸素摂取量', minPercent: 90, maxPercent: 100 },
];

export function calculateMaxHeartRate(age: number): number {
  return 220 - age;
}

export function calculateHeartRateZones(input: HeartRateInput): HeartRateResult {
  const maxHR = calculateMaxHeartRate(input.age);
  const useKarvonen = input.restingHeartRate !== undefined && input.restingHeartRate > 0;

  const zones: HeartRateZone[] = ZONE_DEFINITIONS.map((zone) => {
    let minBpm: number;
    let maxBpm: number;

    if (useKarvonen && input.restingHeartRate !== undefined) {
      const hrr = maxHR - input.restingHeartRate;
      minBpm = Math.round(hrr * (zone.minPercent / 100) + input.restingHeartRate);
      maxBpm = Math.round(hrr * (zone.maxPercent / 100) + input.restingHeartRate);
    } else {
      minBpm = Math.round(maxHR * (zone.minPercent / 100));
      maxBpm = Math.round(maxHR * (zone.maxPercent / 100));
    }

    return {
      name: zone.name,
      nameJa: zone.nameJa,
      minBpm,
      maxBpm,
      minPercent: zone.minPercent,
      maxPercent: zone.maxPercent,
    };
  });

  return {
    maxHeartRate: maxHR,
    method: useKarvonen ? 'karvonen' : 'standard',
    zones,
  };
}

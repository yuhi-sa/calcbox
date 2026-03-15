export type Category = 'length' | 'weight' | 'temperature' | 'area';

export interface UnitDef {
  label: string;
  factor: number; // multiply by this to get base unit
}

// Base unit: meter
export const lengthUnits: Record<string, UnitDef> = {
  mm: { label: 'ミリメートル (mm)', factor: 0.001 },
  cm: { label: 'センチメートル (cm)', factor: 0.01 },
  m: { label: 'メートル (m)', factor: 1 },
  km: { label: 'キロメートル (km)', factor: 1000 },
  inch: { label: 'インチ (in)', factor: 0.0254 },
  ft: { label: 'フィート (ft)', factor: 0.3048 },
  mile: { label: 'マイル (mi)', factor: 1609.344 },
  tsubo_len: { label: '間 (けん)', factor: 1.8182 },
};

// Base unit: gram
export const weightUnits: Record<string, UnitDef> = {
  mg: { label: 'ミリグラム (mg)', factor: 0.001 },
  g: { label: 'グラム (g)', factor: 1 },
  kg: { label: 'キログラム (kg)', factor: 1000 },
  ton: { label: 'トン (t)', factor: 1_000_000 },
  oz: { label: 'オンス (oz)', factor: 28.3495 },
  lb: { label: 'ポンド (lb)', factor: 453.592 },
};

// Base unit: m²
export const areaUnits: Record<string, UnitDef> = {
  m2: { label: '平方メートル (m²)', factor: 1 },
  km2: { label: '平方キロメートル (km²)', factor: 1_000_000 },
  ha: { label: 'ヘクタール (ha)', factor: 10_000 },
  acre: { label: 'エーカー (acre)', factor: 4046.8564224 },
  tsubo: { label: '坪', factor: 3.305785 },
  jou: { label: '畳', factor: 1.6529 },
};

export const categories: Record<Category, Record<string, UnitDef>> = {
  length: lengthUnits,
  weight: weightUnits,
  temperature: {}, // handled separately
  area: areaUnits,
};

export const categoryLabels: Record<Category, string> = {
  length: '長さ',
  weight: '重さ',
  temperature: '温度',
  area: '面積',
};

export const temperatureUnits: Record<string, string> = {
  C: '摂氏 (°C)',
  F: '華氏 (°F)',
  K: 'ケルビン (K)',
};

function convertTemperature(value: number, from: string, to: string): number {
  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case 'C': celsius = value; break;
    case 'F': celsius = (value - 32) * 5 / 9; break;
    case 'K': celsius = value - 273.15; break;
    default: throw new Error(`不明な温度単位: ${from}`);
  }
  // Convert from Celsius to target
  switch (to) {
    case 'C': return celsius;
    case 'F': return celsius * 9 / 5 + 32;
    case 'K': return celsius + 273.15;
    default: throw new Error(`不明な温度単位: ${to}`);
  }
}

export function convert(
  category: Category,
  from: string,
  to: string,
  value: number
): number {
  if (category === 'temperature') {
    return convertTemperature(value, from, to);
  }

  const units = categories[category];
  const fromUnit = units[from];
  const toUnit = units[to];
  if (!fromUnit || !toUnit) throw new Error('不明な単位です');

  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}

export function getUnitsForCategory(category: Category): { key: string; label: string }[] {
  if (category === 'temperature') {
    return Object.entries(temperatureUnits).map(([key, label]) => ({ key, label }));
  }
  return Object.entries(categories[category]).map(([key, def]) => ({ key, label: def.label }));
}

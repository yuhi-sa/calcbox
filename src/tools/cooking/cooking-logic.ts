export type CookingUnit = 'tablespoon' | 'teaspoon' | 'cup' | 'ml' | 'cc' | 'g';

export interface Ingredient {
  name: string;
  nameJa: string;
  densityGPerMl: number; // grams per mL
}

export const INGREDIENTS: Ingredient[] = [
  { name: 'water', nameJa: '水', densityGPerMl: 1.0 },
  { name: 'flour', nameJa: '薄力粉', densityGPerMl: 0.55 },
  { name: 'sugar', nameJa: '砂糖（上白糖）', densityGPerMl: 0.6 },
  { name: 'salt', nameJa: '塩', densityGPerMl: 1.2 },
  { name: 'butter', nameJa: 'バター', densityGPerMl: 0.91 },
  { name: 'oil', nameJa: 'サラダ油', densityGPerMl: 0.92 },
  { name: 'soy_sauce', nameJa: '醤油', densityGPerMl: 1.15 },
  { name: 'miso', nameJa: '味噌', densityGPerMl: 1.1 },
  { name: 'rice', nameJa: '米', densityGPerMl: 0.85 },
  { name: 'bread_flour', nameJa: '強力粉', densityGPerMl: 0.55 },
];

export const UNIT_LABELS: Record<CookingUnit, string> = {
  tablespoon: '大さじ',
  teaspoon: '小さじ',
  cup: 'カップ',
  ml: 'mL',
  cc: 'cc',
  g: 'g',
};

// Volume in mL for each unit
const UNIT_TO_ML: Record<Exclude<CookingUnit, 'g'>, number> = {
  tablespoon: 15,
  teaspoon: 5,
  cup: 200, // Japanese cup = 200mL
  ml: 1,
  cc: 1,
};

export interface CookingConvertInput {
  value: number;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  ingredientIndex: number;
}

export interface CookingConvertResult {
  inputValue: number;
  inputUnit: CookingUnit;
  outputValue: number;
  outputUnit: CookingUnit;
  ingredient: string;
}

function toMl(value: number, unit: CookingUnit, density: number): number {
  if (unit === 'g') {
    return value / density;
  }
  return value * UNIT_TO_ML[unit];
}

function fromMl(ml: number, unit: CookingUnit, density: number): number {
  if (unit === 'g') {
    return ml * density;
  }
  return ml / UNIT_TO_ML[unit];
}

export function convertCookingUnit(input: CookingConvertInput): CookingConvertResult {
  const ingredient = INGREDIENTS[input.ingredientIndex];
  const ml = toMl(input.value, input.fromUnit, ingredient.densityGPerMl);
  const outputValue = fromMl(ml, input.toUnit, ingredient.densityGPerMl);

  return {
    inputValue: input.value,
    inputUnit: input.fromUnit,
    outputValue: Math.round(outputValue * 100) / 100,
    outputUnit: input.toUnit,
    ingredient: ingredient.nameJa,
  };
}

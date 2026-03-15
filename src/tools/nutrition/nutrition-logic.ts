export interface FoodItem {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
}

export const FOOD_DATABASE: FoodItem[] = [
  { name: '白米（炊飯後）', caloriesPer100g: 168, proteinPer100g: 2.5, fatPer100g: 0.3, carbsPer100g: 37.1 },
  { name: '食パン', caloriesPer100g: 260, proteinPer100g: 9.3, fatPer100g: 4.4, carbsPer100g: 46.7 },
  { name: 'うどん（茹で）', caloriesPer100g: 105, proteinPer100g: 2.6, fatPer100g: 0.4, carbsPer100g: 21.6 },
  { name: 'パスタ（茹で）', caloriesPer100g: 165, proteinPer100g: 5.8, fatPer100g: 0.9, carbsPer100g: 31.3 },
  { name: '鶏むね肉', caloriesPer100g: 108, proteinPer100g: 22.3, fatPer100g: 1.5, carbsPer100g: 0 },
  { name: '鶏もも肉', caloriesPer100g: 200, proteinPer100g: 16.2, fatPer100g: 14.0, carbsPer100g: 0 },
  { name: '豚ロース', caloriesPer100g: 263, proteinPer100g: 19.3, fatPer100g: 19.2, carbsPer100g: 0.1 },
  { name: '牛肩ロース', caloriesPer100g: 240, proteinPer100g: 17.9, fatPer100g: 17.4, carbsPer100g: 0.1 },
  { name: 'サーモン', caloriesPer100g: 233, proteinPer100g: 20.1, fatPer100g: 16.1, carbsPer100g: 0.1 },
  { name: 'まぐろ（赤身）', caloriesPer100g: 125, proteinPer100g: 26.4, fatPer100g: 1.4, carbsPer100g: 0.1 },
  { name: '卵', caloriesPer100g: 151, proteinPer100g: 12.3, fatPer100g: 10.3, carbsPer100g: 0.3 },
  { name: '豆腐（木綿）', caloriesPer100g: 72, proteinPer100g: 6.6, fatPer100g: 4.2, carbsPer100g: 1.6 },
  { name: '納豆', caloriesPer100g: 200, proteinPer100g: 16.5, fatPer100g: 10.0, carbsPer100g: 12.1 },
  { name: '牛乳', caloriesPer100g: 67, proteinPer100g: 3.3, fatPer100g: 3.8, carbsPer100g: 4.8 },
  { name: 'ヨーグルト（プレーン）', caloriesPer100g: 62, proteinPer100g: 3.6, fatPer100g: 3.0, carbsPer100g: 4.9 },
  { name: 'バナナ', caloriesPer100g: 86, proteinPer100g: 1.1, fatPer100g: 0.2, carbsPer100g: 22.5 },
  { name: 'りんご', caloriesPer100g: 54, proteinPer100g: 0.2, fatPer100g: 0.1, carbsPer100g: 14.6 },
  { name: 'キャベツ', caloriesPer100g: 23, proteinPer100g: 1.3, fatPer100g: 0.2, carbsPer100g: 5.2 },
  { name: 'トマト', caloriesPer100g: 19, proteinPer100g: 0.7, fatPer100g: 0.1, carbsPer100g: 4.7 },
  { name: 'アボカド', caloriesPer100g: 187, proteinPer100g: 2.5, fatPer100g: 18.7, carbsPer100g: 6.2 },
];

export interface SelectedFood {
  foodIndex: number;
  quantityGrams: number;
}

export interface NutritionEntry {
  name: string;
  quantityGrams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface NutritionResult {
  entries: NutritionEntry[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export function calcNutrition(food: FoodItem, quantityGrams: number): NutritionEntry {
  const ratio = quantityGrams / 100;
  return {
    name: food.name,
    quantityGrams,
    calories: food.caloriesPer100g * ratio,
    protein: food.proteinPer100g * ratio,
    fat: food.fatPer100g * ratio,
    carbs: food.carbsPer100g * ratio,
  };
}

export function calculateNutrition(selections: SelectedFood[]): NutritionResult {
  const entries = selections.map((s) => calcNutrition(FOOD_DATABASE[s.foodIndex], s.quantityGrams));
  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0);
  const totalFat = entries.reduce((sum, e) => sum + e.fat, 0);
  const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0);
  return { entries, totalCalories, totalProtein, totalFat, totalCarbs };
}

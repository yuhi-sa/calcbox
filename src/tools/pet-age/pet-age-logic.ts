export type PetType = 'dog-small' | 'dog-medium' | 'dog-large' | 'cat';

export const PET_TYPE_LABELS: Record<PetType, string> = {
  'dog-small': '犬（小型）',
  'dog-medium': '犬（中型）',
  'dog-large': '犬（大型）',
  'cat': '猫',
};

export interface PetAgeResult {
  humanAge: number;
  petType: PetType;
  petAge: number;
}

export function calcHumanAge(petType: PetType, petAge: number): number {
  if (petAge <= 0) return 0;

  if (petType === 'dog-large') {
    if (petAge <= 1) return petAge * 12;
    if (petAge <= 2) return 12 + (petAge - 1) * 10;
    return 22 + (petAge - 2) * 6;
  }

  // dog-small, dog-medium, cat all use the same formula
  if (petAge <= 1) return petAge * 15;
  if (petAge <= 2) return 15 + (petAge - 1) * 9;
  return 24 + (petAge - 2) * 4;
}

export function calculatePetAge(petType: PetType, petAge: number): PetAgeResult {
  const humanAge = calcHumanAge(petType, petAge);
  return { humanAge, petType, petAge };
}

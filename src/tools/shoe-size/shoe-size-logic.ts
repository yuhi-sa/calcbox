export type SizeSystem = 'jp' | 'us' | 'uk' | 'eu';
export type Gender = 'men' | 'women';

export interface ShoeSizeInput {
  value: number;
  fromSystem: SizeSystem;
  gender: Gender;
}

export interface ShoeSizeResult {
  jp: number;
  us: number;
  uk: number;
  eu: number;
  gender: Gender;
}

export const SIZE_SYSTEM_LABELS: Record<SizeSystem, string> = {
  jp: '日本 (cm)',
  us: 'US',
  uk: 'UK',
  eu: 'EU',
};

// Base conversions using JP (cm) as reference
// Men's: JP -> other systems
function jpToUsMen(jp: number): number {
  return jp - 18;
}

function jpToUkMen(jp: number): number {
  return jp - 18.5;
}

function jpToEu(jp: number): number {
  return Math.round((jp + 1.5) * 2) / 2;
  // Simplified: EU ≈ (JP_cm + 1.5) rounded to nearest 0.5
}

// Women's: JP -> other systems
function jpToUsWomen(jp: number): number {
  return jp - 17;
}

function jpToUkWomen(jp: number): number {
  return jp - 18;
}

function toJp(value: number, fromSystem: SizeSystem, gender: Gender): number {
  switch (fromSystem) {
    case 'jp':
      return value;
    case 'us':
      return gender === 'men' ? value + 18 : value + 17;
    case 'uk':
      return gender === 'men' ? value + 18.5 : value + 18;
    case 'eu':
      return value / 2 - 1.5;
  }
}

export function convertShoeSize(input: ShoeSizeInput): ShoeSizeResult {
  const jp = Math.round(toJp(input.value, input.fromSystem, input.gender) * 2) / 2;

  const us = input.gender === 'men' ? jpToUsMen(jp) : jpToUsWomen(jp);
  const uk = input.gender === 'men' ? jpToUkMen(jp) : jpToUkWomen(jp);
  const eu = jpToEu(jp);

  return {
    jp: Math.round(jp * 10) / 10,
    us: Math.round(us * 10) / 10,
    uk: Math.round(uk * 10) / 10,
    eu: Math.round(eu * 10) / 10,
    gender: input.gender,
  };
}

export interface AgeTableRow {
  westernYear: number;
  eraName: string;
  eraYear: number;
  eraDisplay: string;
  age: number;
  zodiac: string;
}

interface EraRange {
  name: string;
  startYear: number;
  endYear: number;
}

const ERAS: EraRange[] = [
  { name: '明治', startYear: 1868, endYear: 1911 },
  { name: '大正', startYear: 1912, endYear: 1925 },
  { name: '昭和', startYear: 1926, endYear: 1988 },
  { name: '平成', startYear: 1989, endYear: 2018 },
  { name: '令和', startYear: 2019, endYear: 9999 },
];

const ZODIAC_ANIMALS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export function getZodiac(year: number): string {
  // year%12==4 => 子(rat)
  const index = ((year % 12) - 4 + 12) % 12;
  return ZODIAC_ANIMALS[index];
}

export function getEraForYear(year: number): { name: string; eraYear: number } | null {
  for (let i = ERAS.length - 1; i >= 0; i--) {
    if (year >= ERAS[i].startYear) {
      return { name: ERAS[i].name, eraYear: year - ERAS[i].startYear + 1 };
    }
  }
  return null;
}

export function generateAgeTable(
  currentYear: number,
  startBirthYear: number = 1930,
  endBirthYear: number = 2025
): AgeTableRow[] {
  const rows: AgeTableRow[] = [];
  for (let y = startBirthYear; y <= endBirthYear; y++) {
    const era = getEraForYear(y);
    const eraName = era ? era.name : '';
    const eraYear = era ? era.eraYear : 0;
    const eraYearStr = eraYear === 1 ? '元' : String(eraYear);
    rows.push({
      westernYear: y,
      eraName,
      eraYear,
      eraDisplay: era ? `${eraName}${eraYearStr}年` : '',
      age: currentYear - y,
      zodiac: getZodiac(y),
    });
  }
  return rows;
}

export function filterTable(
  rows: AgeTableRow[],
  query: string
): AgeTableRow[] {
  if (!query.trim()) return rows;
  const q = query.trim();
  const num = parseInt(q, 10);
  if (!isNaN(num)) {
    return rows.filter(
      (r) => r.westernYear === num || r.age === num || r.eraYear === num
    );
  }
  return rows.filter(
    (r) => r.eraName.includes(q) || r.eraDisplay.includes(q) || r.zodiac.includes(q)
  );
}

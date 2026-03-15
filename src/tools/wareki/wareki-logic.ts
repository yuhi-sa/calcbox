export interface Era {
  name: string;
  startYear: number;
  endYear: number;
}

export const ERAS: Era[] = [
  { name: '明治', startYear: 1868, endYear: 1912 },
  { name: '大正', startYear: 1912, endYear: 1926 },
  { name: '昭和', startYear: 1926, endYear: 1989 },
  { name: '平成', startYear: 1989, endYear: 2019 },
  { name: '令和', startYear: 2019, endYear: 9999 },
];

export interface WarekiResult {
  eraName: string;
  eraYear: number;
  westernYear: number;
  display: string;
}

export function westernToWareki(year: number): WarekiResult | null {
  for (let i = ERAS.length - 1; i >= 0; i--) {
    const era = ERAS[i];
    if (year >= era.startYear) {
      const eraYear = year - era.startYear + 1;
      const eraYearStr = eraYear === 1 ? '元' : String(eraYear);
      return {
        eraName: era.name,
        eraYear,
        westernYear: year,
        display: `${era.name}${eraYearStr}年（${year}年）`,
      };
    }
  }
  return null;
}

export function warekiToWestern(eraName: string, eraYear: number): WarekiResult | null {
  const era = ERAS.find((e) => e.name === eraName);
  if (!era) return null;
  const westernYear = era.startYear + eraYear - 1;
  if (westernYear > era.endYear) return null;
  const eraYearStr = eraYear === 1 ? '元' : String(eraYear);
  return {
    eraName,
    eraYear,
    westernYear,
    display: `${westernYear}年（${eraName}${eraYearStr}年）`,
  };
}

export function getEraNames(): string[] {
  return ERAS.map((e) => e.name);
}

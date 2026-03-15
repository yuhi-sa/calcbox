export interface PaperSize {
  name: string;
  series: string;
  widthMm: number;
  heightMm: number;
  widthInch: number;
  heightInch: number;
}

function mmToInch(mm: number): number {
  return Math.round((mm / 25.4) * 100) / 100;
}

function createSize(name: string, series: string, widthMm: number, heightMm: number): PaperSize {
  return {
    name,
    series,
    widthMm,
    heightMm,
    widthInch: mmToInch(widthMm),
    heightInch: mmToInch(heightMm),
  };
}

export function getAllPaperSizes(): PaperSize[] {
  return [
    // A series (ISO 216)
    createSize('A0', 'A', 841, 1189),
    createSize('A1', 'A', 594, 841),
    createSize('A2', 'A', 420, 594),
    createSize('A3', 'A', 297, 420),
    createSize('A4', 'A', 210, 297),
    createSize('A5', 'A', 148, 210),
    createSize('A6', 'A', 105, 148),
    createSize('A7', 'A', 74, 105),
    createSize('A8', 'A', 52, 74),
    createSize('A9', 'A', 37, 52),
    createSize('A10', 'A', 26, 37),

    // B series (JIS)
    createSize('B0', 'B (JIS)', 1030, 1456),
    createSize('B1', 'B (JIS)', 728, 1030),
    createSize('B2', 'B (JIS)', 515, 728),
    createSize('B3', 'B (JIS)', 364, 515),
    createSize('B4', 'B (JIS)', 257, 364),
    createSize('B5', 'B (JIS)', 182, 257),
    createSize('B6', 'B (JIS)', 128, 182),
    createSize('B7', 'B (JIS)', 91, 128),
    createSize('B8', 'B (JIS)', 64, 91),
    createSize('B9', 'B (JIS)', 45, 64),
    createSize('B10', 'B (JIS)', 32, 45),

    // Common sizes
    createSize('Letter', 'その他', 216, 279),
    createSize('Legal', 'その他', 216, 356),
    createSize('はがき', 'その他', 100, 148),
    createSize('ポストカード', 'その他', 102, 152),
    createSize('L判', 'その他', 89, 127),
    createSize('2L判', 'その他', 127, 178),
  ];
}

export function filterPaperSizes(query: string, series?: string): PaperSize[] {
  let sizes = getAllPaperSizes();

  if (series) {
    sizes = sizes.filter((s) => s.series === series);
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    sizes = sizes.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.series.toLowerCase().includes(lowerQuery)
    );
  }

  return sizes;
}

export function getSeriesList(): string[] {
  const sizes = getAllPaperSizes();
  return [...new Set(sizes.map((s) => s.series))];
}

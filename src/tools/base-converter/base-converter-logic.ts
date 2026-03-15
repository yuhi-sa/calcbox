export interface ConversionResult {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
}

export function convertBase(value: string, fromBase: number): ConversionResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { binary: '', octal: '', decimal: '', hex: '' };
  }

  const decimal = parseInt(trimmed, fromBase);
  if (isNaN(decimal)) {
    throw new Error('無効な値です');
  }

  return {
    binary: decimal.toString(2),
    octal: decimal.toString(8),
    decimal: decimal.toString(10),
    hex: decimal.toString(16).toUpperCase(),
  };
}

export function isValidForBase(value: string, base: number): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  const parsed = parseInt(trimmed, base);
  if (isNaN(parsed)) return false;
  // Verify round-trip
  return parsed.toString(base).toUpperCase() === trimmed.toUpperCase();
}

export const BASE_OPTIONS = [
  { value: 2, label: '2進数 (Binary)' },
  { value: 8, label: '8進数 (Octal)' },
  { value: 10, label: '10進数 (Decimal)' },
  { value: 16, label: '16進数 (Hex)' },
] as const;

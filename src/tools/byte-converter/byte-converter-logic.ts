export type ByteUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

export const BYTE_UNITS: ByteUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

const BINARY_FACTOR = 1024;
const SI_FACTOR = 1000;

const BINARY_MULTIPLIERS: Record<ByteUnit, number> = {
  B: 1,
  KB: BINARY_FACTOR,
  MB: BINARY_FACTOR ** 2,
  GB: BINARY_FACTOR ** 3,
  TB: BINARY_FACTOR ** 4,
  PB: BINARY_FACTOR ** 5,
};

const SI_MULTIPLIERS: Record<ByteUnit, number> = {
  B: 1,
  KB: SI_FACTOR,
  MB: SI_FACTOR ** 2,
  GB: SI_FACTOR ** 3,
  TB: SI_FACTOR ** 4,
  PB: SI_FACTOR ** 5,
};

export interface ByteConversionResult {
  binary: Record<ByteUnit, string>;
  si: Record<ByteUnit, string>;
}

function formatValue(value: number): string {
  if (value === 0) return '0';
  if (Number.isInteger(value)) return value.toLocaleString();
  if (value < 0.001) return value.toExponential(4);
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function convertBytes(value: number, fromUnit: ByteUnit): ByteConversionResult {
  const bytesFromBinary = value * BINARY_MULTIPLIERS[fromUnit];
  const bytesFromSi = value * SI_MULTIPLIERS[fromUnit];

  const binary = {} as Record<ByteUnit, string>;
  const si = {} as Record<ByteUnit, string>;

  for (const unit of BYTE_UNITS) {
    binary[unit] = formatValue(bytesFromBinary / BINARY_MULTIPLIERS[unit]);
    si[unit] = formatValue(bytesFromSi / SI_MULTIPLIERS[unit]);
  }

  return { binary, si };
}

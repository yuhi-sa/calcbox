export interface AspectRatioResult {
  simplifiedWidth: number;
  simplifiedHeight: number;
  ratio: string;
  decimalRatio: number;
}

export interface DimensionResult {
  width: number;
  height: number;
}

export interface AspectRatioPreset {
  name: string;
  width: number;
  height: number;
}

export const PRESETS: AspectRatioPreset[] = [
  { name: '16:9（ワイドスクリーン）', width: 16, height: 9 },
  { name: '4:3（スタンダード）', width: 4, height: 3 },
  { name: '1:1（正方形）', width: 1, height: 1 },
  { name: '21:9（ウルトラワイド）', width: 21, height: 9 },
  { name: '3:2（写真）', width: 3, height: 2 },
  { name: '9:16（縦型動画）', width: 9, height: 16 },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function calculateAspectRatio(width: number, height: number): AspectRatioResult {
  const divisor = gcd(width, height);
  const simplifiedWidth = width / divisor;
  const simplifiedHeight = height / divisor;
  return {
    simplifiedWidth,
    simplifiedHeight,
    ratio: `${simplifiedWidth}:${simplifiedHeight}`,
    decimalRatio: width / height,
  };
}

export function calculateDimension(
  ratioWidth: number,
  ratioHeight: number,
  knownDimension: number,
  knownSide: 'width' | 'height'
): DimensionResult {
  if (knownSide === 'width') {
    const height = (knownDimension / ratioWidth) * ratioHeight;
    return { width: knownDimension, height: Math.round(height) };
  } else {
    const width = (knownDimension / ratioHeight) * ratioWidth;
    return { width: Math.round(width), height: knownDimension };
  }
}

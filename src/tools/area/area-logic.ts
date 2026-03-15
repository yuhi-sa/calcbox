export type Shape = 'rectangle' | 'triangle' | 'circle' | 'trapezoid';

export interface AreaResult {
  m2: number;
  tsubo: number;
  jou: number;
  ha: number;
  acre: number;
}

export function calcRectangle(width: number, height: number): number {
  return width * height;
}

export function calcTriangle(base: number, height: number): number {
  return (base * height) / 2;
}

export function calcCircle(radius: number): number {
  return Math.PI * radius * radius;
}

export function calcTrapezoid(top: number, bottom: number, height: number): number {
  return ((top + bottom) * height) / 2;
}

export function convertArea(m2: number): AreaResult {
  return {
    m2,
    tsubo: m2 * 0.3025,
    jou: m2 * 0.605,
    ha: m2 / 10000,
    acre: m2 / 4046.8564224,
  };
}

export function calcArea(
  shape: Shape,
  dimensions: { width?: number; height?: number; base?: number; radius?: number; top?: number; bottom?: number }
): AreaResult {
  let m2: number;

  switch (shape) {
    case 'rectangle':
      if (dimensions.width === undefined || dimensions.height === undefined)
        throw new Error('幅と高さを入力してください');
      m2 = calcRectangle(dimensions.width, dimensions.height);
      break;
    case 'triangle':
      if (dimensions.base === undefined || dimensions.height === undefined)
        throw new Error('底辺と高さを入力してください');
      m2 = calcTriangle(dimensions.base, dimensions.height);
      break;
    case 'circle':
      if (dimensions.radius === undefined)
        throw new Error('半径を入力してください');
      m2 = calcCircle(dimensions.radius);
      break;
    case 'trapezoid':
      if (dimensions.top === undefined || dimensions.bottom === undefined || dimensions.height === undefined)
        throw new Error('上辺、下辺、高さを入力してください');
      m2 = calcTrapezoid(dimensions.top, dimensions.bottom, dimensions.height);
      break;
    default:
      throw new Error('不明な形状です');
  }

  return convertArea(m2);
}

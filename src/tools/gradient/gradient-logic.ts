export type GradientType = 'linear' | 'radial';

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export const DIRECTION_PRESETS = [
  { value: 'to right', label: '右へ' },
  { value: 'to left', label: '左へ' },
  { value: 'to bottom', label: '下へ' },
  { value: 'to top', label: '上へ' },
  { value: 'to bottom right', label: '右下へ' },
  { value: 'to bottom left', label: '左下へ' },
  { value: '45deg', label: '45度' },
  { value: '90deg', label: '90度' },
  { value: '135deg', label: '135度' },
  { value: '180deg', label: '180度' },
] as const;

export const RADIAL_SHAPES = [
  { value: 'circle', label: '円形' },
  { value: 'ellipse', label: '楕円形' },
] as const;

export function generateGradientCss(
  type: GradientType,
  stops: GradientStop[],
  direction: string,
  shape: string = 'circle'
): string {
  const colorStops = stops
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');

  if (type === 'linear') {
    return `linear-gradient(${direction}, ${colorStops})`;
  }
  return `radial-gradient(${shape}, ${colorStops})`;
}

export function parseGradientCss(css: string): {
  type: GradientType;
  stops: GradientStop[];
  direction: string;
} | null {
  const linearMatch = css.match(/^linear-gradient\((.+)\)$/);
  if (linearMatch) {
    const parts = linearMatch[1].split(',').map((s) => s.trim());
    const direction = parts[0];
    const stops: GradientStop[] = parts.slice(1).map((p) => {
      const match = p.match(/^(.+?)\s+(\d+)%$/);
      if (!match) return { color: p, position: 0 };
      return { color: match[1], position: parseInt(match[2]) };
    });
    return { type: 'linear', stops, direction };
  }
  return null;
}

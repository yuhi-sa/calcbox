export interface WbgtInput {
  temperature: number;  // °C
  humidity: number;     // %
}

export type DangerLevel = 'ほぼ安全' | '注意' | '警戒' | '厳重警戒' | '危険';

export interface WbgtResult {
  wbgt: number;
  dangerLevel: DangerLevel;
  recommendation: string;
}

export function estimateWbgt(temperature: number, humidity: number): number {
  // Simplified WBGT estimation using temperature and humidity
  // Approximation: WBGT ≈ 0.735×Tw + 0.0374×Tg + 0.2×Ta
  // Using wet-bulb approximation from temp and humidity:
  // Tw ≈ T * atan(0.151977 * sqrt(RH + 8.313659)) + atan(T + RH) - atan(RH - 1.676331) + 0.00391838 * RH^1.5 * atan(0.023101 * RH) - 4.686035
  // Simplified approach: blend temperature and humidity effect
  const tw = temperature * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659))
    + Math.atan(temperature + humidity)
    - Math.atan(humidity - 1.676331)
    + 0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity)
    - 4.686035;

  // Globe temperature approximation (outdoor, no wind): Tg ≈ T + 2~5°C in sun
  const tg = temperature + 3;

  const wbgt = 0.735 * tw + 0.0374 * tg + 0.2 * temperature;
  return Math.round(wbgt * 10) / 10;
}

export function getDangerLevel(wbgt: number): DangerLevel {
  if (wbgt >= 31) return '危険';
  if (wbgt >= 28) return '厳重警戒';
  if (wbgt >= 25) return '警戒';
  if (wbgt >= 21) return '注意';
  return 'ほぼ安全';
}

export function getRecommendation(level: DangerLevel): string {
  switch (level) {
    case '危険':
      return '運動は原則中止。外出を避け、涼しい室内で過ごしてください。';
    case '厳重警戒':
      return '激しい運動は避けてください。こまめな水分・塩分補給が必要です。';
    case '警戒':
      return '積極的に休憩を取り、水分補給を心がけてください。';
    case '注意':
      return '適度な水分補給を行いましょう。激しい運動時は注意が必要です。';
    case 'ほぼ安全':
      return '通常の活動が可能です。適度な水分補給を心がけましょう。';
  }
}

export function calculateWbgt(input: WbgtInput): WbgtResult {
  const wbgt = estimateWbgt(input.temperature, input.humidity);
  const dangerLevel = getDangerLevel(wbgt);
  const recommendation = getRecommendation(dangerLevel);
  return { wbgt, dangerLevel, recommendation };
}

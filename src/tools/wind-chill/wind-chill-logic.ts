export type WindSpeedUnit = 'm/s' | 'km/h';

export interface WindChillInput {
  temperature: number;    // °C
  windSpeed: number;
  windSpeedUnit: WindSpeedUnit;
}

export type DangerLevel = '安全' | '注意' | '警戒' | '厳重警戒' | '危険';

export interface WindChillResult {
  windChill: number;
  dangerLevel: DangerLevel;
  frostbiteRisk: string;
  windSpeedKmh: number;
  isValid: boolean;
  validationMessage: string;
}

export function toKmh(speed: number, unit: WindSpeedUnit): number {
  return unit === 'm/s' ? speed * 3.6 : speed;
}

export function calcWindChill(tempC: number, windKmh: number): number {
  // Wind chill formula (Environment Canada / NWS)
  // Valid for T <= 10°C and V > 4.8 km/h
  const wc = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
  return Math.round(wc * 10) / 10;
}

export function getDangerLevel(windChill: number): DangerLevel {
  if (windChill <= -25) return '危険';
  if (windChill <= -10) return '厳重警戒';
  if (windChill <= 0) return '警戒';
  if (windChill <= 10) return '注意';
  return '安全';
}

export function getFrostbiteRisk(windChill: number): string {
  if (windChill <= -45) return '数分以内に凍傷の危険があります。屋外活動は厳禁です。';
  if (windChill <= -25) return '10〜30分で凍傷の危険があります。露出した肌を保護してください。';
  if (windChill <= -10) return '30分以上の露出で凍傷のリスクがあります。防寒対策を徹底してください。';
  if (windChill <= 0) return '長時間の露出は低体温症のリスクがあります。手袋・帽子を着用してください。';
  return '凍傷のリスクは低いですが、防寒対策は忘れずに。';
}

export function calculateWindChill(input: WindChillInput): WindChillResult {
  const windSpeedKmh = toKmh(input.windSpeed, input.windSpeedUnit);

  // Validity check
  if (input.temperature > 10 || windSpeedKmh <= 4.8) {
    return {
      windChill: input.temperature,
      dangerLevel: getDangerLevel(input.temperature),
      frostbiteRisk: '風速体感温度の計算条件外です（気温10°C以下、風速4.8km/h超が必要）。',
      windSpeedKmh,
      isValid: false,
      validationMessage: '気温が10°Cを超えるか、風速が4.8km/h以下のため、体感温度は気温とほぼ同じです。',
    };
  }

  const windChill = calcWindChill(input.temperature, windSpeedKmh);
  const dangerLevel = getDangerLevel(windChill);
  const frostbiteRisk = getFrostbiteRisk(windChill);

  return {
    windChill,
    dangerLevel,
    frostbiteRisk,
    windSpeedKmh,
    isValid: true,
    validationMessage: '',
  };
}

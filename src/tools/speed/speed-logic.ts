export type CalcMode = 'speed' | 'distance' | 'time';

export interface SpeedResult {
  speed: number;       // km/h
  distance: number;    // km
  time: number;        // hours
  pace: number;        // min/km
  marathonTime: string; // formatted time for 42.195km
}

export function calcSpeed(distance: number, time: number): number {
  if (time <= 0) throw new Error('時間は0より大きくしてください');
  return distance / time;
}

export function calcDistance(speed: number, time: number): number {
  return speed * time;
}

export function calcTime(distance: number, speed: number): number {
  if (speed <= 0) throw new Error('速度は0より大きくしてください');
  return distance / speed;
}

export function speedToPace(speedKmh: number): number {
  if (speedKmh <= 0) return 0;
  return 60 / speedKmh; // min/km
}

export function formatTime(hours: number): string {
  const totalSeconds = Math.round(hours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}時間${m.toString().padStart(2, '0')}分${s.toString().padStart(2, '0')}秒`;
}

export function calcMarathonTime(speedKmh: number): string {
  if (speedKmh <= 0) return '-';
  const hours = 42.195 / speedKmh;
  return formatTime(hours);
}

export function calculate(
  mode: CalcMode,
  values: { speed?: number; distance?: number; time?: number }
): SpeedResult {
  let speed: number;
  let distance: number;
  let time: number;

  switch (mode) {
    case 'speed':
      if (values.distance === undefined || values.time === undefined)
        throw new Error('距離と時間を入力してください');
      distance = values.distance;
      time = values.time;
      speed = calcSpeed(distance, time);
      break;
    case 'distance':
      if (values.speed === undefined || values.time === undefined)
        throw new Error('速度と時間を入力してください');
      speed = values.speed;
      time = values.time;
      distance = calcDistance(speed, time);
      break;
    case 'time':
      if (values.distance === undefined || values.speed === undefined)
        throw new Error('距離と速度を入力してください');
      distance = values.distance;
      speed = values.speed;
      time = calcTime(distance, speed);
      break;
    default:
      throw new Error('不明な計算モードです');
  }

  const pace = speedToPace(speed);
  const marathonTime = calcMarathonTime(speed);

  return { speed, distance, time, pace, marathonTime };
}

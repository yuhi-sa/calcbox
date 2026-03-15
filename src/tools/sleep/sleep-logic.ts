export const SLEEP_CYCLE_MINUTES = 90;
export const FALL_ASLEEP_MINUTES = 15;

export interface SleepTime {
  time: Date;
  cycles: number;
  hours: number;
}

export interface SleepResult {
  mode: 'wake' | 'bed';
  times: SleepTime[];
}

export function calcBedtimes(wakeUpTime: Date): SleepTime[] {
  const results: SleepTime[] = [];
  for (let cycles = 6; cycles >= 4; cycles--) {
    const totalMinutes = cycles * SLEEP_CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
    const bedtime = new Date(wakeUpTime.getTime() - totalMinutes * 60 * 1000);
    results.push({ time: bedtime, cycles, hours: (cycles * SLEEP_CYCLE_MINUTES) / 60 });
  }
  return results;
}

export function calcWakeTimes(bedtime: Date): SleepTime[] {
  const results: SleepTime[] = [];
  for (let cycles = 4; cycles <= 6; cycles++) {
    const totalMinutes = cycles * SLEEP_CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
    const wakeTime = new Date(bedtime.getTime() + totalMinutes * 60 * 1000);
    results.push({ time: wakeTime, cycles, hours: (cycles * SLEEP_CYCLE_MINUTES) / 60 });
  }
  return results;
}

export function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function calculateSleep(mode: 'wake' | 'bed', time: Date): SleepResult {
  const times = mode === 'wake' ? calcBedtimes(time) : calcWakeTimes(time);
  return { mode, times };
}

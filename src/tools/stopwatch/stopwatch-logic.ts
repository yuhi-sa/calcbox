export interface LapEntry {
  lapNumber: number;
  lapTime: number; // ms since previous lap
  cumulativeTime: number; // ms since start
  lapTimeFormatted: string;
  cumulativeFormatted: string;
}

export function formatElapsed(ms: number): string {
  const totalMs = Math.max(0, ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const millis = totalMs % 1000;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

export function calculateLap(
  currentElapsed: number,
  previousLaps: LapEntry[]
): LapEntry {
  const lastCumulative = previousLaps.length > 0
    ? previousLaps[previousLaps.length - 1].cumulativeTime
    : 0;
  const lapTime = currentElapsed - lastCumulative;
  const lapNumber = previousLaps.length + 1;

  return {
    lapNumber,
    lapTime,
    cumulativeTime: currentElapsed,
    lapTimeFormatted: formatElapsed(lapTime),
    cumulativeFormatted: formatElapsed(currentElapsed),
  };
}

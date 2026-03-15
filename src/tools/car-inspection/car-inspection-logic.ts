export type VehicleType = '普通車' | '軽自動車' | '新車';

export interface CarInspectionInput {
  registrationDate: string; // ISO date string (YYYY-MM-DD)
  vehicleType: VehicleType;
}

export interface InspectionSchedule {
  date: string; // ISO date string
  label: string;
}

export interface CarInspectionResult {
  nextInspectionDate: string;
  daysRemaining: number;
  upcomingInspections: InspectionSchedule[];
  vehicleType: VehicleType;
}

export function addYears(dateStr: string, years: number): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().split('T')[0];
}

export function diffDays(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateCarInspection(
  input: CarInspectionInput,
  today: string = new Date().toISOString().split('T')[0]
): CarInspectionResult {
  const { registrationDate, vehicleType } = input;

  // Build full inspection schedule from registration date
  const inspections: InspectionSchedule[] = [];

  // First inspection: 3 years for 新車, 2 years otherwise
  const firstInterval = vehicleType === '新車' ? 3 : 2;
  const firstDate = addYears(registrationDate, firstInterval);
  inspections.push({ date: firstDate, label: '初回車検' });

  // Subsequent inspections every 2 years, generate up to 20
  let prev = firstDate;
  for (let i = 1; i < 20; i++) {
    const next = addYears(prev, 2);
    inspections.push({ date: next, label: `${i + 1}回目車検` });
    prev = next;
  }

  // Find upcoming inspections (on or after today)
  const upcoming = inspections.filter((insp) => insp.date >= today);
  const next3 = upcoming.slice(0, 3);

  const nextInspectionDate = next3.length > 0 ? next3[0].date : '';
  const daysRemaining = nextInspectionDate ? diffDays(today, nextInspectionDate) : 0;

  return {
    nextInspectionDate,
    daysRemaining,
    upcomingInspections: next3,
    vehicleType,
  };
}

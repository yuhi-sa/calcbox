export interface PensionResult {
  nationalPensionYearly: number;
  nationalPensionMonthly: number;
  employeePensionYearly: number;
  employeePensionMonthly: number;
  totalYearly: number;
  totalMonthly: number;
}

const NATIONAL_PENSION_FULL_ANNUAL = 795000;
const NATIONAL_PENSION_FULL_MONTHS = 480; // 40 years
const EMPLOYEE_PENSION_MULTIPLIER = 0.005481;

export function calcNationalPension(monthsPaid: number): number {
  const clampedMonths = Math.min(Math.max(0, monthsPaid), NATIONAL_PENSION_FULL_MONTHS);
  return Math.round(NATIONAL_PENSION_FULL_ANNUAL * (clampedMonths / NATIONAL_PENSION_FULL_MONTHS));
}

export function calcEmployeePension(averageMonthlySalary: number, enrollmentMonths: number): number {
  return Math.round(averageMonthlySalary * EMPLOYEE_PENSION_MULTIPLIER * enrollmentMonths);
}

export function calcPension(
  averageMonthlySalary: number,
  nationalMonths: number,
  employeeMonths: number
): PensionResult {
  const nationalPensionYearly = calcNationalPension(nationalMonths);
  const employeePensionYearly = calcEmployeePension(averageMonthlySalary, employeeMonths);
  const totalYearly = nationalPensionYearly + employeePensionYearly;

  return {
    nationalPensionYearly,
    nationalPensionMonthly: Math.round(nationalPensionYearly / 12),
    employeePensionYearly,
    employeePensionMonthly: Math.round(employeePensionYearly / 12),
    totalYearly,
    totalMonthly: Math.round(totalYearly / 12),
  };
}

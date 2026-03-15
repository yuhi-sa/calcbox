export interface SalaryResult {
  annualGross: number;
  annualNet: number;
  monthlyNet: number;
  healthInsurance: number;
  pension: number;
  employmentInsurance: number;
  nursingInsurance: number;
  socialInsuranceTotal: number;
  incomeTax: number;
  residentTax: number;
  taxTotal: number;
  deductionTotal: number;
}

function calcEmploymentIncomeDeduction(annualIncome: number): number {
  if (annualIncome <= 1625000) return 550000;
  if (annualIncome <= 1800000) return annualIncome * 0.4 - 100000;
  if (annualIncome <= 3600000) return annualIncome * 0.3 + 80000;
  if (annualIncome <= 6600000) return annualIncome * 0.2 + 440000;
  if (annualIncome <= 8500000) return annualIncome * 0.1 + 1100000;
  return 1950000;
}

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 1950000) return taxableIncome * 0.05;
  if (taxableIncome <= 3300000) return taxableIncome * 0.10 - 97500;
  if (taxableIncome <= 6950000) return taxableIncome * 0.20 - 427500;
  if (taxableIncome <= 9000000) return taxableIncome * 0.23 - 636000;
  if (taxableIncome <= 18000000) return taxableIncome * 0.33 - 1536000;
  if (taxableIncome <= 40000000) return taxableIncome * 0.40 - 2796000;
  return taxableIncome * 0.45 - 4796000;
}

export function calculateSalary(annualGross: number, age: number, dependents: number): SalaryResult {
  const healthInsurance = Math.floor(annualGross * 0.05);
  const pension = Math.floor(annualGross * 0.0915);
  const employmentInsurance = Math.floor(annualGross * 0.006);
  const nursingInsurance = age >= 40 ? Math.floor(annualGross * 0.008) : 0;
  const socialInsuranceTotal = healthInsurance + pension + employmentInsurance + nursingInsurance;

  const employmentIncomeDeduction = calcEmploymentIncomeDeduction(annualGross);
  let incomeAfterDeduction = annualGross - employmentIncomeDeduction;
  if (incomeAfterDeduction < 0) incomeAfterDeduction = 0;

  const basicDeduction = 480000;
  const dependentDeductionIncomeTax = dependents * 380000;
  let taxableIncomeForIncomeTax = incomeAfterDeduction - basicDeduction - socialInsuranceTotal - dependentDeductionIncomeTax;
  if (taxableIncomeForIncomeTax < 0) taxableIncomeForIncomeTax = 0;
  taxableIncomeForIncomeTax = Math.floor(taxableIncomeForIncomeTax / 1000) * 1000;
  const incomeTax = Math.floor(calcIncomeTax(taxableIncomeForIncomeTax));

  const basicDeductionResident = 430000;
  const dependentDeductionResident = dependents * 330000;
  let taxableIncomeForResident = incomeAfterDeduction - basicDeductionResident - socialInsuranceTotal - dependentDeductionResident;
  if (taxableIncomeForResident < 0) taxableIncomeForResident = 0;
  taxableIncomeForResident = Math.floor(taxableIncomeForResident / 1000) * 1000;
  const residentTax = Math.floor(taxableIncomeForResident * 0.10);

  const taxTotal = incomeTax + residentTax;
  const deductionTotal = socialInsuranceTotal + taxTotal;
  const annualNet = annualGross - deductionTotal;
  const monthlyNet = Math.floor(annualNet / 12);

  return {
    annualGross, annualNet, monthlyNet,
    healthInsurance, pension, employmentInsurance, nursingInsurance,
    socialInsuranceTotal, incomeTax, residentTax, taxTotal, deductionTotal,
  };
}

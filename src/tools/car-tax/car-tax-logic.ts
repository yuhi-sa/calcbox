export type VehicleType = '普通車' | '軽自動車';

export interface CarTaxResult {
  vehicleType: string;
  displacement: number;
  baseTax: number;
  surcharge: number;
  totalTax: number;
  isOverAge: boolean;
  displayTax: string;
  bracket: string;
}

interface TaxBracket {
  maxCc: number;
  tax: number;
  label: string;
}

const taxBrackets: TaxBracket[] = [
  { maxCc: 1000, tax: 25000, label: '1,000cc以下' },
  { maxCc: 1500, tax: 30500, label: '1,000cc超〜1,500cc以下' },
  { maxCc: 2000, tax: 36000, label: '1,500cc超〜2,000cc以下' },
  { maxCc: 2500, tax: 43500, label: '2,000cc超〜2,500cc以下' },
  { maxCc: 3000, tax: 50000, label: '2,500cc超〜3,000cc以下' },
  { maxCc: 3500, tax: 57000, label: '3,000cc超〜3,500cc以下' },
  { maxCc: 4000, tax: 65500, label: '3,500cc超〜4,000cc以下' },
  { maxCc: 4500, tax: 75500, label: '4,000cc超〜4,500cc以下' },
  { maxCc: 6000, tax: 87000, label: '4,500cc超〜6,000cc以下' },
];

const KEI_TAX = 10800;

export function getBaseTax(vehicleType: VehicleType, displacementCc: number): { tax: number; bracket: string } {
  if (vehicleType === '軽自動車') {
    return { tax: KEI_TAX, bracket: '軽自動車' };
  }

  for (const b of taxBrackets) {
    if (displacementCc <= b.maxCc) {
      return { tax: b.tax, bracket: b.label };
    }
  }
  return { tax: 110000, bracket: '6,000cc超' };
}

export function calculateCarTax(
  vehicleType: VehicleType,
  displacementCc: number,
  isOver13Years: boolean,
): CarTaxResult {
  const { tax: baseTax, bracket } = getBaseTax(vehicleType, displacementCc);
  const surcharge = isOver13Years ? Math.floor(baseTax * 0.15) : 0;
  const totalTax = baseTax + surcharge;

  return {
    vehicleType,
    displacement: displacementCc,
    baseTax,
    surcharge,
    totalTax,
    isOverAge: isOver13Years,
    displayTax: `${totalTax.toLocaleString()}円`,
    bracket,
  };
}

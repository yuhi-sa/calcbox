export interface TaxResult {
  resultPrice: number;
  taxAmount: number;
  originalPrice: number;
  resultPriceLabel: string;
  originalPriceLabel: string;
}

export function calculateTax(
  price: number,
  taxRate: number,
  direction: 'exclude-to-include' | 'include-to-exclude'
): TaxResult {
  if (direction === 'exclude-to-include') {
    const taxAmount = price * taxRate;
    return {
      resultPrice: price + taxAmount,
      taxAmount,
      originalPrice: price,
      resultPriceLabel: '税込価格',
      originalPriceLabel: '税抜価格',
    };
  } else {
    const originalPrice = price / (1 + taxRate);
    const taxAmount = price - originalPrice;
    return {
      resultPrice: Math.round(originalPrice),
      taxAmount: Math.round(taxAmount),
      originalPrice: price,
      resultPriceLabel: '税抜価格',
      originalPriceLabel: '税込価格',
    };
  }
}

export interface MultiItemResult {
  subtotal: number;
  totalTax: number;
  total: number;
}

export function calculateMultiItemTax(items: { price: number; rate: number }[]): MultiItemResult {
  let subtotal = 0;
  let totalTax = 0;
  for (const item of items) {
    subtotal += item.price;
    totalTax += Math.floor(item.price * item.rate);
  }
  return { subtotal, totalTax, total: subtotal + totalTax };
}

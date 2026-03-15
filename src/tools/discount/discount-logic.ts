export interface DiscountResult {
  discountedPrice: number;
  savings: number;
  effectiveRate: number;
}

export function calcDiscount(
  originalPrice: number,
  discountRate: number,
  secondDiscountRate?: number
): DiscountResult {
  if (originalPrice < 0) throw new Error('価格は0以上にしてください');
  if (discountRate < 0 || discountRate > 100) throw new Error('割引率は0〜100%にしてください');
  if (secondDiscountRate !== undefined && (secondDiscountRate < 0 || secondDiscountRate > 100)) {
    throw new Error('2回目の割引率は0〜100%にしてください');
  }

  let discountedPrice = originalPrice * (1 - discountRate / 100);

  if (secondDiscountRate !== undefined && secondDiscountRate > 0) {
    discountedPrice = discountedPrice * (1 - secondDiscountRate / 100);
  }

  const savings = originalPrice - discountedPrice;
  const effectiveRate = originalPrice > 0 ? (savings / originalPrice) * 100 : 0;

  return {
    discountedPrice: Math.round(discountedPrice),
    savings: Math.round(savings),
    effectiveRate,
  };
}

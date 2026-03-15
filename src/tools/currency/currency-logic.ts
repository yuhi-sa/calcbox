export const fallbackRates: Record<string, number> = {
  USD: 1,
  JPY: 149.50,
  EUR: 0.92,
  GBP: 0.79,
  CNY: 7.24,
  KRW: 1330,
  TWD: 32.5,
  AUD: 1.55,
  CAD: 1.36,
  CHF: 0.89,
};

export const currencyNames: Record<string, string> = {
  USD: '米ドル (USD)',
  JPY: '日本円 (JPY)',
  EUR: 'ユーロ (EUR)',
  GBP: '英ポンド (GBP)',
  CNY: '中国元 (CNY)',
  KRW: '韓国ウォン (KRW)',
  TWD: '台湾ドル (TWD)',
  AUD: '豪ドル (AUD)',
  CAD: 'カナダドル (CAD)',
  CHF: 'スイスフラン (CHF)',
};

export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  const amountInUSD = amount / rates[from];
  return amountInUSD * rates[to];
}

export function formatCurrencyNumber(num: number, currency: string): string {
  if (currency === 'JPY' || currency === 'KRW') return num.toFixed(0);
  return num.toFixed(2);
}

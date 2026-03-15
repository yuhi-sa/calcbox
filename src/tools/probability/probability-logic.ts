export type CalculationType = 'factorial' | 'permutation' | 'combination';

export function factorial(n: number): bigint {
  if (n < 0) throw new Error('負の数の階乗は定義されていません');
  if (n === 0 || n === 1) return 1n;
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

export function permutation(n: number, r: number): bigint {
  if (n < 0 || r < 0) throw new Error('n, r は0以上の整数を指定してください');
  if (r > n) throw new Error('r は n 以下である必要があります');
  // nPr = n! / (n-r)!
  let result = 1n;
  for (let i = BigInt(n); i > BigInt(n - r); i--) {
    result *= i;
  }
  return result;
}

export function combination(n: number, r: number): bigint {
  if (n < 0 || r < 0) throw new Error('n, r は0以上の整数を指定してください');
  if (r > n) throw new Error('r は n 以下である必要があります');
  // nCr = nPr / r!
  // Optimize: use smaller r
  const k = Math.min(r, n - r);
  let result = 1n;
  for (let i = 0; i < k; i++) {
    result = result * BigInt(n - i) / BigInt(i + 1);
  }
  return result;
}

export function calculate(type: CalculationType, n: number, r: number): bigint {
  switch (type) {
    case 'factorial':
      return factorial(n);
    case 'permutation':
      return permutation(n, r);
    case 'combination':
      return combination(n, r);
  }
}

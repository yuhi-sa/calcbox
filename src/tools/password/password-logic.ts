export const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/~`',
};

function getSecureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

export function generatePassword(length: number, charset: string): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[getSecureRandom(charset.length)];
  }
  return password;
}

export interface PasswordStrength {
  label: string;
  level: 1 | 2 | 3 | 4;
  color: string;
}

export function evaluateStrength(length: number, charsetSize: number): PasswordStrength {
  const entropy = length * (Math.log(charsetSize) / Math.log(2));
  if (entropy < 40) return { label: '弱', level: 1, color: '#e74c3c' };
  if (entropy < 60) return { label: '中', level: 2, color: '#f39c12' };
  if (entropy < 80) return { label: '強', level: 3, color: '#27ae60' };
  return { label: '非常に強い', level: 4, color: '#2980b9' };
}

export function buildCharset(options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }): string {
  let charset = '';
  if (options.uppercase) charset += CHARSETS.uppercase;
  if (options.lowercase) charset += CHARSETS.lowercase;
  if (options.numbers) charset += CHARSETS.numbers;
  if (options.symbols) charset += CHARSETS.symbols;
  return charset;
}

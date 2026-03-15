export interface QrCodeOptions {
  text: string;
  size: number;
}

export interface QrCodeResult {
  url: string;
  isValid: boolean;
  error?: string;
}

export function validateInput(text: string): { isValid: boolean; error?: string } {
  if (!text.trim()) {
    return { isValid: false, error: 'テキストを入力してください' };
  }
  if (text.length > 2048) {
    return { isValid: false, error: 'テキストは2048文字以内にしてください' };
  }
  return { isValid: true };
}

export function buildQrUrl(text: string, size: number): string {
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
}

export function generateQrCode(options: QrCodeOptions): QrCodeResult {
  const validation = validateInput(options.text);
  if (!validation.isValid) {
    return { url: '', isValid: false, error: validation.error };
  }

  const size = Math.max(100, Math.min(1000, options.size));
  const url = buildQrUrl(options.text, size);
  return { url, isValid: true };
}

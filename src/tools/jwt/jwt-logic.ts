export interface JwtDecodeResult {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
  expiresAt: string | null;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('無効なJWTトークンです。3つのパートが必要です。');
  }

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
  } catch {
    throw new Error('ヘッダーのデコードに失敗しました');
  }

  try {
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new Error('ペイロードのデコードに失敗しました');
  }

  let isExpired: boolean | null = null;
  let expiresAt: string | null = null;

  if (typeof payload.exp === 'number') {
    const expDate = new Date(payload.exp * 1000);
    expiresAt = expDate.toISOString();
    isExpired = expDate.getTime() < Date.now();
  }

  return {
    header,
    payload,
    signature: parts[2],
    isExpired,
    expiresAt,
  };
}

export function isValidJwtFormat(token: string): boolean {
  const parts = token.trim().split('.');
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

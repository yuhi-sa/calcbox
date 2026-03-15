function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < byteArray.length; i++) {
    hex += ('0' + byteArray[i].toString(16)).slice(-2);
  }
  return hex;
}

export async function computeHash(algorithm: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return arrayBufferToHex(buffer);
}

export async function computeAllHashes(text: string): Promise<{ sha1: string; sha256: string; sha512: string }> {
  const [sha1, sha256, sha512] = await Promise.all([
    computeHash('SHA-1', text),
    computeHash('SHA-256', text),
    computeHash('SHA-512', text),
  ]);
  return { sha1, sha256, sha512 };
}

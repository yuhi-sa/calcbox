export type EncodingType = 'base64' | 'url' | 'html';
export type Direction = 'encode' | 'decode';

export function base64Encode(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function base64Decode(text: string): string {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

export function urlDecode(text: string): string {
  return decodeURIComponent(text);
}

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const HTML_ENTITIES_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(HTML_ENTITIES).map(([k, v]) => [v, k])
);

export function htmlEncode(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch] || ch);
}

export function htmlDecode(text: string): string {
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (entity) => HTML_ENTITIES_REVERSE[entity] || entity);
}

export function processEncode(text: string, type: EncodingType, direction: Direction): string {
  if (direction === 'encode') {
    switch (type) {
      case 'base64': return base64Encode(text);
      case 'url': return urlEncode(text);
      case 'html': return htmlEncode(text);
    }
  } else {
    switch (type) {
      case 'base64': return base64Decode(text);
      case 'url': return urlDecode(text);
      case 'html': return htmlDecode(text);
    }
  }
}

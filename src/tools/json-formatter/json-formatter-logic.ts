export interface FormatResult {
  formatted: string;
  valid: boolean;
  error?: string;
}

export function formatJson(input: string, indent: number = 2): FormatResult {
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed, null, indent), valid: true };
  } catch (e) {
    return { formatted: input, valid: false, error: (e as Error).message };
  }
}

export function minifyJson(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed), valid: true };
  } catch (e) {
    return { formatted: input, valid: false, error: (e as Error).message };
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

export interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexResult {
  matches: MatchResult[];
  count: number;
  valid: boolean;
  error?: string;
}

export function testRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) {
    return { matches: [], count: 0, valid: true };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: MatchResult[] = [];

    if (flags.includes('g')) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        if (!match[0]) regex.lastIndex++;
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    }

    return { matches, count: matches.length, valid: true };
  } catch (e) {
    return { matches: [], count: 0, valid: false, error: (e as Error).message };
  }
}

export function validatePattern(pattern: string, flags: string): { valid: boolean; error?: string } {
  try {
    new RegExp(pattern, flags);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

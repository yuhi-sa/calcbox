export interface CharacterCountResult {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  bytes: number;
  paragraphs: number;
}

export function countCharacters(text: string): CharacterCountResult {
  if (!text) {
    return { characters: 0, charactersNoSpaces: 0, words: 0, lines: 0, bytes: 0, paragraphs: 0 };
  }

  const characters = [...text].length;
  const charactersNoSpaces = [...text.replace(/\s/g, '')].length;
  const words = countWords(text);
  const lines = text.split('\n').length;
  const bytes = new TextEncoder().encode(text).length;
  const paragraphs = countParagraphs(text);

  return { characters, charactersNoSpaces, words, lines, bytes, paragraphs };
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  // Check if text is primarily Japanese/CJK
  const cjkPattern = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uff00-\uff9f]/;
  if (cjkPattern.test(trimmed)) {
    // For Japanese text, count CJK characters individually and split non-CJK by spaces
    const cjkChars = [...trimmed].filter(ch => cjkPattern.test(ch)).length;
    const nonCjk = trimmed.replace(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uff00-\uff9f]/g, ' ').trim();
    const nonCjkWords = nonCjk ? nonCjk.split(/\s+/).filter(w => w.length > 0).length : 0;
    return cjkChars + nonCjkWords;
  }

  // For English/Latin text, split by whitespace
  return trimmed.split(/\s+/).filter(w => w.length > 0).length;
}

export function countParagraphs(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

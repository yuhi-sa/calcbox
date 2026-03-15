import { describe, it, expect } from 'vitest';
import { countCharacters, countWords, countParagraphs } from './character-count-logic';

describe('character-count', () => {
  it('counts empty text', () => {
    const result = countCharacters('');
    expect(result.characters).toBe(0);
    expect(result.words).toBe(0);
    expect(result.lines).toBe(0);
    expect(result.bytes).toBe(0);
    expect(result.paragraphs).toBe(0);
  });

  it('counts English text correctly', () => {
    const result = countCharacters('Hello World');
    expect(result.characters).toBe(11);
    expect(result.charactersNoSpaces).toBe(10);
    expect(result.words).toBe(2);
    expect(result.lines).toBe(1);
    expect(result.bytes).toBe(11);
  });

  it('counts Japanese text correctly', () => {
    const result = countCharacters('こんにちは');
    expect(result.characters).toBe(5);
    expect(result.charactersNoSpaces).toBe(5);
    expect(result.words).toBe(5); // Each CJK char counts as a word
    expect(result.bytes).toBe(15); // 3 bytes per hiragana in UTF-8
  });

  it('counts lines correctly', () => {
    const result = countCharacters('line1\nline2\nline3');
    expect(result.lines).toBe(3);
  });

  it('counts paragraphs correctly', () => {
    expect(countParagraphs('para1\n\npara2\n\npara3')).toBe(3);
    expect(countParagraphs('single paragraph')).toBe(1);
    expect(countParagraphs('')).toBe(0);
  });

  it('counts words for English text', () => {
    expect(countWords('one two three')).toBe(3);
    expect(countWords('  spaces  everywhere  ')).toBe(2);
    expect(countWords('')).toBe(0);
  });
});

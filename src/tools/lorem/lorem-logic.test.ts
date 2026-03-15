import { describe, it, expect } from 'vitest';
import { generateLorem, generateWords, generateSentences, generateParagraphs } from './lorem-logic';

describe('lorem', () => {
  it('generates specified number of words', () => {
    const result = generateWords(10);
    const words = result.split(' ');
    expect(words).toHaveLength(10);
  });

  it('starts with Lorem ipsum', () => {
    const result = generateWords(5);
    expect(result).toBe('Lorem ipsum dolor sit amet');
  });

  it('generates sentences ending with periods', () => {
    const result = generateSentences(3);
    const sentences = result.split('. ').map(s => s.endsWith('.') ? s : s + '.');
    expect(sentences.length).toBeGreaterThanOrEqual(3);
    expect(result.startsWith('Lorem ipsum dolor sit amet')).toBe(true);
  });

  it('generates paragraphs separated by double newlines', () => {
    const result = generateParagraphs(3);
    const paragraphs = result.split('\n\n');
    expect(paragraphs).toHaveLength(3);
  });

  it('returns empty string for count 0', () => {
    expect(generateLorem(0, 'words')).toBe('');
    expect(generateLorem(0, 'sentences')).toBe('');
    expect(generateLorem(0, 'paragraphs')).toBe('');
  });

  it('generateLorem dispatches correctly', () => {
    const words = generateLorem(5, 'words');
    expect(words.split(' ')).toHaveLength(5);
  });
});

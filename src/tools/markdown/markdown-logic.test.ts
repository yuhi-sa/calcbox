import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './markdown-logic';

describe('markdown parsing', () => {
  it('parses headings', () => {
    expect(parseMarkdown('# Hello')).toContain('<h1');
    expect(parseMarkdown('## World')).toContain('<h2');
  });

  it('parses bold text', () => {
    expect(parseMarkdown('**bold**')).toContain('<strong>bold</strong>');
  });

  it('parses italic text', () => {
    expect(parseMarkdown('*italic*')).toContain('<em>italic</em>');
  });

  it('parses inline code', () => {
    expect(parseMarkdown('`code`')).toContain('<code');
    expect(parseMarkdown('`code`')).toContain('code');
  });

  it('parses unordered lists', () => {
    const result = parseMarkdown('- item 1\n- item 2');
    expect(result).toContain('<ul');
    expect(result).toContain('<li>item 1</li>');
    expect(result).toContain('<li>item 2</li>');
  });

  it('parses ordered lists', () => {
    const result = parseMarkdown('1. first\n2. second');
    expect(result).toContain('<ol');
  });

  it('parses code blocks', () => {
    const result = parseMarkdown('```\ncode here\n```');
    expect(result).toContain('<pre');
    expect(result).toContain('code here');
  });

  it('parses horizontal rules', () => {
    expect(parseMarkdown('---')).toContain('<hr');
  });

  it('escapes HTML', () => {
    expect(parseMarkdown('<script>alert("xss")</script>')).not.toContain('<script>');
  });
});

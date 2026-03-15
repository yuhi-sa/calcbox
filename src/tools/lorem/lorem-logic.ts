export type LoremUnit = 'paragraphs' | 'sentences' | 'words';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'blandit', 'volutpat',
  'maecenas', 'accumsan', 'lacus', 'vel', 'facilisis', 'varius', 'natoque',
  'penatibus', 'magnis', 'dis', 'parturient', 'montes', 'nascetur', 'ridiculus',
  'mus', 'mauris', 'vitae', 'ultricies', 'leo', 'integer', 'malesuada', 'fames',
  'ac', 'turpis', 'egestas', 'pretium', 'vulputate', 'sapien', 'nec', 'sagittis',
  'aliquam', 'sem', 'fringilla', 'urna', 'porttitor', 'rhoncus', 'pellentesque',
  'habitant', 'morbi', 'tristique', 'senectus', 'netus',
];

const FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

function getWord(index: number): string {
  return LOREM_WORDS[index % LOREM_WORDS.length];
}

export function generateWords(count: number, startWithLorem: boolean = true): string {
  if (count <= 0) return '';
  const words: string[] = [];

  if (startWithLorem) {
    const loremStart = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    const take = Math.min(count, loremStart.length);
    words.push(...loremStart.slice(0, take));
  }

  let idx = startWithLorem ? 8 : 0;
  while (words.length < count) {
    words.push(getWord(idx++));
  }

  return words.join(' ');
}

export function generateSentence(wordCount: number, wordOffset: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(getWord(wordOffset + i));
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

export function generateSentences(count: number, startWithLorem: boolean = true): string {
  if (count <= 0) return '';
  const sentences: string[] = [];

  if (startWithLorem) {
    sentences.push(FIRST_SENTENCE);
  }

  let offset = 8;
  while (sentences.length < count) {
    const wordCount = 6 + (offset % 8); // 6-13 words per sentence
    sentences.push(generateSentence(wordCount, offset));
    offset += wordCount;
  }

  return sentences.join(' ');
}

export function generateParagraph(sentenceCount: number, wordOffset: number): string {
  const sentences: string[] = [];
  let offset = wordOffset;
  for (let i = 0; i < sentenceCount; i++) {
    const wordCount = 6 + (offset % 8);
    sentences.push(generateSentence(wordCount, offset));
    offset += wordCount;
  }
  return sentences.join(' ');
}

export function generateParagraphs(count: number, startWithLorem: boolean = true): string {
  if (count <= 0) return '';
  const paragraphs: string[] = [];

  if (startWithLorem) {
    paragraphs.push(FIRST_SENTENCE + ' ' + generateParagraph(3, 8));
  }

  let offset = 30;
  while (paragraphs.length < count) {
    const sentenceCount = 3 + (offset % 4); // 3-6 sentences per paragraph
    paragraphs.push(generateParagraph(sentenceCount, offset));
    offset += sentenceCount * 10;
  }

  return paragraphs.join('\n\n');
}

export function generateLorem(count: number, unit: LoremUnit): string {
  switch (unit) {
    case 'words':
      return generateWords(count);
    case 'sentences':
      return generateSentences(count);
    case 'paragraphs':
      return generateParagraphs(count);
  }
}

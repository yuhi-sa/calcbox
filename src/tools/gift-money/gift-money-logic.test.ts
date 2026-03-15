import { describe, it, expect } from 'vitest';
import { calculateGiftMoney, getWeddingRelationships, getFuneralRelationships } from './gift-money-logic';

describe('Gift Money Reference', () => {
  it('returns correct wedding gift amount for 友人', () => {
    const result = calculateGiftMoney('wedding', '友人');
    expect(result.minAmount).toBe(30000);
    expect(result.maxAmount).toBe(30000);
    expect(result.displayAmount).toBe('3万円');
    expect(result.occasion).toBe('ご祝儀（結婚式）');
  });

  it('returns correct wedding gift range for 上司', () => {
    const result = calculateGiftMoney('wedding', '上司');
    expect(result.minAmount).toBe(30000);
    expect(result.maxAmount).toBe(50000);
    expect(result.displayAmount).toBe('3万円〜5万円');
  });

  it('returns correct funeral amount for 同僚', () => {
    const result = calculateGiftMoney('funeral', '同僚');
    expect(result.minAmount).toBe(5000);
    expect(result.maxAmount).toBe(5000);
    expect(result.displayAmount).toBe('5千円');
  });

  it('returns correct funeral amount for 両親', () => {
    const result = calculateGiftMoney('funeral', '両親');
    expect(result.minAmount).toBe(50000);
    expect(result.maxAmount).toBe(100000);
    expect(result.displayAmount).toBe('5万円〜10万円');
    expect(result.notes.length).toBeGreaterThan(0);
  });

  it('returns notes with etiquette advice', () => {
    const result = calculateGiftMoney('wedding', '友人');
    expect(result.notes).toContain('新札を用意しましょう');
  });

  it('lists correct relationships', () => {
    expect(getWeddingRelationships()).toEqual(['友人', '同僚', '上司', '親族', '兄弟姉妹']);
    expect(getFuneralRelationships()).toEqual(['友人', '同僚', '上司', '親族', '祖父母', '両親']);
  });
});

export interface RandomResult {
  numbers: number[];
}

export function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomNumbers(
  min: number,
  max: number,
  count: number,
  unique: boolean = false
): number[] {
  if (min > max) throw new Error('最小値は最大値以下にしてください');
  if (count <= 0) throw new Error('生成数は1以上にしてください');
  if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('整数を入力してください');

  if (unique) {
    const range = max - min + 1;
    if (count > range) throw new Error(`重複なしの場合、生成数は${range}以下にしてください`);

    const set = new Set<number>();
    while (set.size < count) {
      set.add(generateRandomInt(min, max));
    }
    return Array.from(set);
  }

  return Array.from({ length: count }, () => generateRandomInt(min, max));
}

export function pickFromList<T>(list: T[], count: number = 1): T[] {
  if (list.length === 0) throw new Error('リストが空です');
  if (count <= 0) throw new Error('選択数は1以上にしてください');

  return Array.from({ length: count }, () => {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  });
}

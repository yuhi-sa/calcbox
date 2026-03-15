export type LineStatus = 'same' | 'added' | 'removed';

export interface DiffLine {
  text: string;
  status: LineStatus;
  lineNumber1?: number;
  lineNumber2?: number;
}

export function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const lcs = computeLCS(lines1, lines2);
  return buildDiffFromLCS(lines1, lines2, lcs);
}

function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

function buildDiffFromLCS(lines1: string[], lines2: string[], dp: number[][]): DiffLine[] {
  const result: DiffLine[] = [];
  let i = lines1.length;
  let j = lines2.length;
  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      stack.push({ text: lines1[i - 1], status: 'same', lineNumber1: i, lineNumber2: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ text: lines2[j - 1], status: 'added', lineNumber2: j });
      j--;
    } else {
      stack.push({ text: lines1[i - 1], status: 'removed', lineNumber1: i });
      i--;
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop()!);
  }

  return result;
}

export function getDiffStats(diff: DiffLine[]): { same: number; added: number; removed: number } {
  let same = 0, added = 0, removed = 0;
  for (const line of diff) {
    if (line.status === 'same') same++;
    else if (line.status === 'added') added++;
    else removed++;
  }
  return { same, added, removed };
}

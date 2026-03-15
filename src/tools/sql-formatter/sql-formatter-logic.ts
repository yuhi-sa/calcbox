const KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'AND', 'OR', 'GROUP BY', 'ORDER BY',
  'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'SET',
  'VALUES', 'INTO', 'LIMIT', 'OFFSET', 'UNION', 'LEFT', 'RIGHT', 'INNER',
  'OUTER', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'EXISTS',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
];

const MAJOR_CLAUSES = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'OUTER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'UNION',
  'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'SET', 'VALUES',
];

const SUB_CLAUSES = ['AND', 'OR', 'ON', 'WHEN', 'THEN', 'ELSE'];

export function uppercaseKeywords(sql: string): string {
  // Sort keywords by length descending to match longer ones first (e.g. "GROUP BY" before "GROUP")
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length);

  let result = sql;
  for (const kw of sorted) {
    const regex = new RegExp(`\\b${kw.replace(' ', '\\s+')}\\b`, 'gi');
    result = result.replace(regex, kw);
  }
  return result;
}

export function formatSQL(sql: string): string {
  if (!sql.trim()) return '';

  // First, uppercase keywords
  let formatted = uppercaseKeywords(sql);

  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, ' ').trim();

  // Add newlines before major clauses and sub-clauses
  const allNewlineClauses = [...MAJOR_CLAUSES, ...SUB_CLAUSES].sort((a, b) => b.length - a.length);
  for (const clause of allNewlineClauses) {
    const regex = new RegExp(`\\s+(?=${escapeRegex(clause)}\\b)`, 'gi');
    formatted = formatted.replace(regex, '\n');
  }

  // Indent sub-clauses
  const lines = formatted.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line starts with a sub-clause
    const isSubClause = SUB_CLAUSES.some(sc => trimmed.startsWith(sc + ' ') || trimmed === sc);
    const isMajorClause = MAJOR_CLAUSES.some(mc => trimmed.startsWith(mc + ' ') || trimmed === mc);

    if (isSubClause && !isMajorClause) {
      result.push('  ' + trimmed);
    } else {
      result.push(trimmed);
    }
  }

  return result.join('\n');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

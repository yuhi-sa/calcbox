export type Delimiter = ',' | '\t' | ';';
export type ConvertDirection = 'csv-to-json' | 'json-to-csv';

export function csvToJson(csv: string, delimiter: Delimiter = ','): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('CSVにはヘッダー行とデータ行が必要です');

  const headers = parseCsvLine(lines[0], delimiter);
  const result = lines.slice(1).map((line) => {
    const values = parseCsvLine(line, delimiter);
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });

  return JSON.stringify(result, null, 2);
}

function parseCsvLine(line: string, delimiter: Delimiter): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function jsonToCsv(json: string, delimiter: Delimiter = ','): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('JSON配列が必要です');
  }

  const headers = Object.keys(data[0]);
  const csvLines = [headers.join(delimiter)];

  for (const row of data) {
    const values = headers.map((h) => {
      const val = String(row[h] ?? '');
      if (val.includes(delimiter) || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvLines.push(values.join(delimiter));
  }

  return csvLines.join('\n');
}

export function convertCsvJson(input: string, direction: ConvertDirection, delimiter: Delimiter = ','): string {
  if (direction === 'csv-to-json') {
    return csvToJson(input, delimiter);
  }
  return jsonToCsv(input, delimiter);
}

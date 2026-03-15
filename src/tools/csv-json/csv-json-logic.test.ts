import { describe, it, expect } from 'vitest';
import { csvToJson, jsonToCsv, convertCsvJson } from './csv-json-logic';

describe('csv-json', () => {
  it('converts CSV to JSON', () => {
    const csv = 'name,age\nAlice,30\nBob,25';
    const result = JSON.parse(csvToJson(csv));
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'Alice', age: '30' });
    expect(result[1]).toEqual({ name: 'Bob', age: '25' });
  });

  it('converts JSON to CSV', () => {
    const json = JSON.stringify([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]);
    const csv = jsonToCsv(json);
    expect(csv).toContain('name,age');
    expect(csv).toContain('Alice,30');
  });

  it('handles tab delimiter', () => {
    const csv = 'name\tage\nAlice\t30';
    const result = JSON.parse(csvToJson(csv, '\t'));
    expect(result[0]).toEqual({ name: 'Alice', age: '30' });
  });

  it('handles semicolon delimiter', () => {
    const csv = 'name;age\nAlice;30';
    const result = JSON.parse(csvToJson(csv, ';'));
    expect(result[0]).toEqual({ name: 'Alice', age: '30' });
  });

  it('handles quoted fields with commas', () => {
    const csv = 'name,city\n"Doe, John","New York"';
    const result = JSON.parse(csvToJson(csv));
    expect(result[0].name).toBe('Doe, John');
  });

  it('throws on empty CSV', () => {
    expect(() => csvToJson('header')).toThrow();
  });

  it('throws on non-array JSON', () => {
    expect(() => jsonToCsv('{"key": "value"}')).toThrow();
  });

  it('routes correctly via convertCsvJson', () => {
    const csv = 'a,b\n1,2';
    const json = convertCsvJson(csv, 'csv-to-json');
    const back = convertCsvJson(json, 'json-to-csv');
    expect(back).toContain('a,b');
  });
});

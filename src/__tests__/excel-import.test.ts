import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { excelCellToString, parseXlsxSheet, UnsupportedFileError } from '@/lib/imports/excel';

/**
 * The dealer import flow parses attacker-supplied spreadsheets, so it was the
 * whole attack surface for the two unpatched `xlsx` advisories. These tests pin
 * the replacement parser against a real workbook: exceljs returns rich text,
 * formula results, hyperlinks and Dates instead of plain strings, so the
 * flattening is where a silent regression would hide.
 */

async function buildWorkbook(
  rows: unknown[][],
  decorate?: (sheet: ExcelJS.Worksheet) => void
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Inventory');
  for (const row of rows) sheet.addRow(row);
  decorate?.(sheet);
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

describe('excelCellToString', () => {
  it('flattens the shapes exceljs actually returns', () => {
    expect(excelCellToString(null)).toBe('');
    expect(excelCellToString(undefined)).toBe('');
    expect(excelCellToString('Trail King')).toBe('Trail King');
    expect(excelCellToString(85000)).toBe('85000');
    expect(excelCellToString(new Date('2026-09-15T12:00:00Z'))).toBe('2026-09-15');
    expect(excelCellToString({ richText: [{ text: 'Trail ' }, { text: 'King' }] })).toBe('Trail King');
    expect(excelCellToString({ formula: 'A1*2', result: 170000 })).toBe('170000');
    expect(excelCellToString({ text: 'Dallas, TX' })).toBe('Dallas, TX');
    expect(excelCellToString({ hyperlink: 'https://example.com/unit/1' })).toBe('https://example.com/unit/1');
  });

  it('yields an empty string for a formula error rather than "#DIV/0!"', () => {
    expect(excelCellToString({ formula: 'A1/0', result: '#DIV/0!', error: '#DIV/0!' })).toBe('');
  });
});

describe('parseXlsxSheet', () => {
  it('reads a real workbook into lower-cased headers and row records', async () => {
    const buffer = await buildWorkbook([
      ['Title', 'Price', 'Year', 'Make'],
      ['2020 Trail King Lowboy', 85000, 2020, 'Trail King'],
      ['2018 Fontaine Flatbed', 42000, 2018, 'Fontaine'],
    ]);

    const { headers, rows } = await parseXlsxSheet(buffer, 500);

    expect(headers).toEqual(['title', 'price', 'year', 'make']);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      title: '2020 Trail King Lowboy',
      price: '85000',
      year: '2020',
      make: 'Trail King',
    });
    expect(rows[1].make).toBe('Fontaine');
  });

  it('skips fully blank rows but keeps partially filled ones', async () => {
    const buffer = await buildWorkbook([
      ['Title', 'Price'],
      ['A lowboy trailer', 1000],
      [null, null],
      ['A flatbed trailer', null],
    ]);

    const { rows } = await parseXlsxSheet(buffer, 500);

    expect(rows).toHaveLength(2);
    expect(rows[1]).toEqual({ title: 'A flatbed trailer', price: '' });
  });

  it('stops reading well before a huge sheet can exhaust memory', async () => {
    const data: unknown[][] = [['Title']];
    for (let i = 0; i < 50; i++) data.push([`Unit ${i}`]);

    const { rows } = await parseXlsxSheet(await buildWorkbook(data), 10);

    // One row past the cap is kept so the caller can still report "too many".
    expect(rows.length).toBeGreaterThan(10);
    expect(rows.length).toBeLessThan(15);
  });

  it('returns nothing for a header-only sheet', async () => {
    const { headers, rows } = await parseXlsxSheet(await buildWorkbook([['Title', 'Price']]), 500);
    expect(headers).toEqual([]);
    expect(rows).toEqual([]);
  });

  it('rejects a file that is not a spreadsheet with a message the user can act on', async () => {
    await expect(parseXlsxSheet(Buffer.from('this is not a spreadsheet'), 500)).rejects.toBeInstanceOf(
      UnsupportedFileError
    );
  });
});

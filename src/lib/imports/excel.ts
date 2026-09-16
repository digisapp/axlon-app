/**
 * Spreadsheet parsing for the dealer import flows.
 *
 * Parsed with exceljs rather than `xlsx`: the latter carries a high-severity
 * prototype-pollution advisory and a ReDoS advisory with no published fix, and
 * uploaded-spreadsheet parsing is the one place in the app that feeds an
 * attacker-supplied file to a parser.
 */

/** A file the user can fix by re-saving. Callers surface this as a 400. */
export class UnsupportedFileError extends Error {}

/**
 * exceljs hands back rich text, formula results, hyperlinks and Dates rather
 * than plain strings, so flatten each cell to the text a human would see.
 */
export function excelCellToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'object') {
    const cell = value as {
      richText?: Array<{ text?: string }>;
      text?: unknown;
      result?: unknown;
      hyperlink?: unknown;
      error?: unknown;
    };
    if (Array.isArray(cell.richText)) return cell.richText.map((part) => part.text ?? '').join('');
    if (cell.text !== undefined) return String(cell.text);
    // A formula cell carries its computed result, or an error like #DIV/0!.
    if (cell.result !== undefined) return cell.error ? '' : String(cell.result);
    if (cell.hyperlink !== undefined) return String(cell.hyperlink);
    return '';
  }
  return String(value);
}

export interface ParsedSheet {
  headers: string[];
  rows: Record<string, string>[];
}

/**
 * Read the first worksheet of an .xlsx/.xlsm buffer into lower-cased headers
 * plus one record per non-empty row.
 *
 * `maxRows` bounds how much is read, so a sheet with a million rows cannot be
 * used to exhaust memory; one extra row is kept so the caller can still detect
 * and report an over-limit file.
 */
export async function parseXlsxSheet(buffer: Buffer, maxRows: number): Promise<ParsedSheet> {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  } catch {
    throw new UnsupportedFileError(
      'That spreadsheet could not be opened. Please re-save it as .xlsx or CSV and try again.'
    );
  }

  const sheet = workbook.worksheets[0];
  if (!sheet) return { headers: [], rows: [] };

  const grid: string[][] = [];
  sheet.eachRow({ includeEmpty: false }, (row) => {
    if (grid.length > maxRows + 1) return;
    // exceljs row values are 1-indexed, with index 0 unused.
    const values = (row.values as unknown[]).slice(1);
    grid.push(values.map(excelCellToString));
  });

  if (grid.length < 2) return { headers: [], rows: [] };

  const headers = grid[0].map((h) => String(h).toLowerCase().trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < grid.length; i++) {
    const values = grid[i];
    const row: Record<string, string> = {};
    let hasData = false;
    headers.forEach((header, idx) => {
      const value = String(values[idx] ?? '').trim();
      row[header] = value;
      if (value) hasData = true;
    });
    if (hasData) rows.push(row);
  }

  return { headers, rows };
}

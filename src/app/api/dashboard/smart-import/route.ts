import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { enforceFeature } from '@/lib/entitlements';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import {
  detectDataType,
  parseInventoryBatch,
  parseCRMBatch,
  analyzeDocument,
  type SmartImportPreview,
} from '@/lib/ai/smart-import';

const ALLOWED_MIME_TYPES = [
  'text/csv',
  'text/plain',
  'application/json',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_ROWS = 500;

// --- CSV Parser (ported from BulkImportWizard) ---

function parseCSVLine(line: string): string[] {
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
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSVBuffer(buffer: Buffer): {
  rows: Record<string, string>[];
  headers: string[];
} {
  const text = buffer.toString('utf-8');
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { rows: [], headers: [] };

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }

  return { rows, headers };
}

// --- File Content Extraction ---

async function extractContent(file: File, buffer: Buffer): Promise<{
  rows: Record<string, string>[];
  rawText: string;
  headers: string[];
  format: 'tabular' | 'text';
}> {
  const name = file.name.toLowerCase();

  // CSV
  if (file.type === 'text/csv' || name.endsWith('.csv')) {
    const { rows, headers } = parseCSVBuffer(buffer);
    return { rows, headers, rawText: '', format: 'tabular' };
  }

  // Excel
  if (file.type.includes('spreadsheetml') || file.type.includes('ms-excel') || name.match(/\.xlsx?$/)) {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' });

    if (rawData.length < 2) return { rows: [], headers: [], rawText: '', format: 'tabular' };

    const headers = (rawData[0] as string[]).map(h => String(h).toLowerCase().trim());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < rawData.length; i++) {
      const values = rawData[i] as string[];
      const row: Record<string, string> = {};
      let hasData = false;
      headers.forEach((h, idx) => {
        const val = String(values[idx] || '').trim();
        row[h] = val;
        if (val) hasData = true;
      });
      if (hasData) rows.push(row);
    }

    return { rows, headers, rawText: '', format: 'tabular' };
  }

  // PDF
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string }>;
    const parsed = await pdfParse(buffer);
    return { rows: [], rawText: parsed.text.slice(0, 50000), headers: [], format: 'text' };
  }

  // JSON
  if (file.type === 'application/json' || name.endsWith('.json')) {
    const text = buffer.toString('utf-8');
    try {
      const json = JSON.parse(text);
      if (Array.isArray(json) && json.length > 0 && typeof json[0] === 'object') {
        const headers = Object.keys(json[0]).map(k => k.toLowerCase().trim());
        const rows = json.map((item: Record<string, unknown>) => {
          const row: Record<string, string> = {};
          Object.entries(item).forEach(([k, v]) => {
            row[k.toLowerCase().trim()] = String(v ?? '');
          });
          return row;
        });
        return { rows, headers, rawText: '', format: 'tabular' };
      }
      return { rows: [], rawText: text.slice(0, 50000), headers: [], format: 'text' };
    } catch {
      return { rows: [], rawText: text.slice(0, 50000), headers: [], format: 'text' };
    }
  }

  // TXT, DOCX, Markdown — treat as text
  return { rows: [], rawText: buffer.toString('utf-8').slice(0, 50000), headers: [], format: 'text' };
}

// --- Route Handler ---

export const POST = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'bulkImport');
  if (gateError) return gateError;

  // Parse multipart form data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const hint = (formData.get('hint') as string) || 'auto';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File must be under 25MB' }, { status: 400 });
  }

  // Validate MIME type (also check by extension as fallback)
  const ext = file.name.toLowerCase().split('.').pop();
  const validExtensions = ['csv', 'xlsx', 'xls', 'pdf', 'txt', 'json', 'docx', 'md'];
  if (!ALLOWED_MIME_TYPES.includes(file.type) && !validExtensions.includes(ext || '')) {
    return NextResponse.json(
      { error: 'Supported formats: CSV, Excel, PDF, TXT, JSON, DOCX' },
      { status: 400 },
    );
  }

  // Extract content
  const buffer = Buffer.from(await file.arrayBuffer());
  const content = await extractContent(file, buffer);

  // Row limit for tabular data
  if (content.format === 'tabular' && content.rows.length > MAX_ROWS) {
    return NextResponse.json(
      { error: `File has ${content.rows.length} rows. Maximum is ${MAX_ROWS}. Please split into smaller files.` },
      { status: 400 },
    );
  }

  // Handle text/document files
  if (content.format === 'text' || content.rows.length === 0) {
    if (!content.rawText.trim()) {
      return NextResponse.json({ error: 'File appears to be empty' }, { status: 400 });
    }

    const analysis = await analyzeDocument(content.rawText, file.name);

    const preview: SmartImportPreview = {
      detectedType: 'document',
      detectedSource: 'Uploaded file',
      confidence: 0.8,
      totalRows: 0,
      validRows: 0,
      warningRows: 0,
      columnMapping: {},
      previewRows: [],
      allRows: [],
      unmappedColumns: [],
      fileName: file.name,
      documentPreview: {
        suggestedTitle: analysis.suggestedTitle,
        suggestedType: analysis.suggestedType,
        summary: analysis.summary,
      },
    };

    return NextResponse.json(preview);
  }

  // Detect data type
  const detection = await detectDataType(content.headers, content.rows, file.name);

  // Use hint to override if provided and detection is uncertain
  const effectiveType = hint !== 'auto' && detection.confidence < 0.7
    ? (hint === 'crm' ? 'crm_contacts' : hint === 'inventory' ? 'inventory' : detection.dataType)
    : detection.dataType;

  if (effectiveType === 'unknown') {
    const preview: SmartImportPreview = {
      detectedType: 'unknown',
      detectedSource: detection.detectedSource,
      confidence: detection.confidence,
      totalRows: content.rows.length,
      validRows: 0,
      warningRows: 0,
      columnMapping: detection.columnMapping,
      previewRows: [],
      allRows: [],
      unmappedColumns: content.headers,
      fileName: file.name,
    };

    return NextResponse.json(preview);
  }

  // Parse rows based on detected type
  if (effectiveType === 'inventory') {
    const { parsed, unmappedColumns } = await parseInventoryBatch(
      content.rows,
      detection.columnMapping,
      detection.detectedSource,
    );

    const validRows = parsed.filter(r => r.confidence >= 0.6).length;
    const warningRows = parsed.filter(r => r.confidence >= 0.4 && r.confidence < 0.6).length;

    const preview: SmartImportPreview = {
      detectedType: 'inventory',
      detectedSource: detection.detectedSource,
      confidence: detection.confidence,
      totalRows: parsed.length,
      validRows,
      warningRows,
      columnMapping: detection.columnMapping,
      previewRows: parsed.slice(0, 10),
      allRows: parsed,
      unmappedColumns,
      fileName: file.name,
    };

    return NextResponse.json(preview);
  }

  if (effectiveType === 'crm_contacts') {
    const { parsed, unmappedColumns } = await parseCRMBatch(
      content.rows,
      detection.columnMapping,
      detection.detectedSource,
    );

    const validRows = parsed.filter(r => r.confidence >= 0.6).length;
    const warningRows = parsed.filter(r => r.confidence >= 0.4 && r.confidence < 0.6).length;

    const preview: SmartImportPreview = {
      detectedType: 'crm_contacts',
      detectedSource: detection.detectedSource,
      confidence: detection.confidence,
      totalRows: parsed.length,
      validRows,
      warningRows,
      columnMapping: detection.columnMapping,
      previewRows: parsed.slice(0, 10),
      allRows: parsed,
      unmappedColumns,
      fileName: file.name,
    };

    return NextResponse.json(preview);
  }

  return NextResponse.json({ error: 'Unsupported data type detected' }, { status: 422 });
}, { rateLimit: { ...RATE_LIMITS.ai, prefix: 'ratelimit:smart-import' } });

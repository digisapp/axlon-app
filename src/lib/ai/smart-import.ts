import { createXai } from '@ai-sdk/xai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Lazy initialization to avoid build-time errors
function getXai() {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY is not configured');
  }
  return createXai({
    apiKey: process.env.XAI_API_KEY,
  });
}

// --- Schemas for AI output ---

const detectionSchema = z.object({
  dataType: z.enum(['inventory', 'crm_contacts', 'document', 'unknown'])
    .describe('What type of data this file contains'),
  confidence: z.number().min(0).max(1)
    .describe('How confident you are in the detection (0-1)'),
  reasoning: z.string()
    .describe('Brief explanation of why this data type was detected'),
  detectedSource: z.string()
    .describe('Likely source system, e.g. "TruckPaper export", "Salesforce CRM", "Google Sheets", "Custom spreadsheet"'),
  columnMapping: z.record(z.string(), z.string())
    .describe('Maps detected column names to canonical field names'),
});

const inventoryRowSchema = z.object({
  title: z.string().optional().describe('Listing title, synthesize from year+make+model if missing'),
  category: z.string().optional().describe('Category slug like heavy-duty-trucks, trailers, lowboys, flatbeds, reefers, dump-trucks, semi-trucks'),
  price: z.number().optional().describe('Price in USD, strip $ and commas'),
  condition: z.enum(['new', 'excellent', 'good', 'fair', 'salvage']).optional()
    .describe('Condition, map "used" to "good", "certified" to "excellent"'),
  year: z.number().int().optional().describe('4-digit year'),
  make: z.string().optional(),
  model: z.string().optional(),
  vin: z.string().optional().describe('VIN, max 17 chars'),
  mileage: z.number().optional().describe('Mileage as integer'),
  hours: z.number().optional().describe('Engine hours as integer'),
  description: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional().describe('2-letter state abbreviation'),
  stock_number: z.string().optional(),
  acquisition_cost: z.number().optional().describe('Cost in USD'),
  confidence: z.number().min(0).max(1).describe('Row confidence: 0.9+ all fields present, 0.6-0.9 some missing, <0.6 garbage'),
  issues: z.array(z.string()).describe('Data quality warnings for this row'),
});

const inventoryBatchSchema = z.object({
  rows: z.array(inventoryRowSchema),
  unmappedColumns: z.array(z.string()).describe('Column names that could not be mapped'),
});

const crmRowSchema = z.object({
  name: z.string().describe('Contact full name'),
  email: z.string().optional().describe('Email address'),
  phone: z.string().optional().describe('Phone number'),
  company: z.string().optional().describe('Company or dealership name'),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).default('new'),
  source: z.string().default('manual').describe('Lead source'),
  notes: z.string().optional().describe('Any additional info or notes'),
  deal_value: z.number().optional().describe('Deal value in USD'),
  confidence: z.number().min(0).max(1).describe('Row confidence'),
  issues: z.array(z.string()).describe('Data quality warnings'),
});

const crmBatchSchema = z.object({
  rows: z.array(crmRowSchema),
  unmappedColumns: z.array(z.string()),
});

const documentAnalysisSchema = z.object({
  suggestedTitle: z.string().describe('A good title for this document'),
  suggestedType: z.enum(['spec_sheet', 'warranty', 'policy', 'brochure', 'price_list', 'general'])
    .describe('Best document category'),
  summary: z.string().describe('Brief summary of what this document contains'),
});

// --- Types ---

export interface DetectionResult {
  dataType: 'inventory' | 'crm_contacts' | 'document' | 'unknown';
  confidence: number;
  reasoning: string;
  detectedSource: string;
  columnMapping: Record<string, string>;
}

export interface ParsedInventoryRow {
  title?: string;
  category?: string;
  price?: number;
  condition?: string;
  year?: number;
  make?: string;
  model?: string;
  vin?: string;
  mileage?: number;
  hours?: number;
  description?: string;
  city?: string;
  state?: string;
  stock_number?: string;
  acquisition_cost?: number;
  confidence: number;
  issues: string[];
}

export interface ParsedCRMRow {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  source: string;
  notes?: string;
  deal_value?: number;
  confidence: number;
  issues: string[];
}

export interface DocumentAnalysis {
  suggestedTitle: string;
  suggestedType: string;
  summary: string;
}

export interface SmartImportPreview {
  detectedType: 'inventory' | 'crm_contacts' | 'document' | 'unknown';
  detectedSource: string;
  confidence: number;
  totalRows: number;
  validRows: number;
  warningRows: number;
  columnMapping: Record<string, string>;
  previewRows: (ParsedInventoryRow | ParsedCRMRow)[];
  allRows: (ParsedInventoryRow | ParsedCRMRow)[];
  unmappedColumns: string[];
  fileName: string;
  documentPreview?: DocumentAnalysis;
}

// --- Detection ---

export async function detectDataType(
  headers: string[],
  sampleRows: Record<string, string>[],
  fileName: string,
): Promise<DetectionResult> {
  const xai = getXai();

  const formattedSample = sampleRows.slice(0, 30).map((row, i) => {
    const values = headers.map(h => row[h] || '');
    return `Row ${i + 1}: ${values.join(' | ')}`;
  }).join('\n');

  const { object } = await generateObject({
    model: xai('grok-4-1-fast-non-reasoning'),
    schema: detectionSchema,
    prompt: `You are analyzing a data file uploaded by a commercial truck/trailer dealer who is migrating to a new platform.

File name: ${fileName}

Column headers: ${headers.join(', ')}

First ${Math.min(sampleRows.length, 30)} rows of data:
${formattedSample}

Determine:
1. What type of data this is:
   - "inventory" = vehicle/equipment listings (trucks, trailers, heavy equipment with fields like make, model, year, price, VIN)
   - "crm_contacts" = customer/lead contact records (names, emails, phones, companies, deal values)
   - "document" = not tabular data, just text content (spec sheets, policies, brochures)
   - "unknown" = cannot determine

2. Map the detected column headers to canonical field names.
   For inventory: title, price, condition, year, make, model, vin, mileage, hours, description, city, state, stock_number, category, acquisition_cost
   For CRM: name, email, phone, company, status, notes, deal_value

3. Identify the likely source system (TruckPaper, Salesforce, HubSpot, CDK, DealerSocket, EverLogic, Google Sheets, Excel, etc.)

Column mapping must map detected column names EXACTLY as they appear to our field names.
If a column doesn't map to any field, omit it from the mapping.`,
  });

  return object;
}

// --- Batch Parsing ---

const CHUNK_SIZE = 50;

export async function parseInventoryBatch(
  rows: Record<string, string>[],
  columnMapping: Record<string, string>,
  detectedSource: string,
): Promise<{ parsed: ParsedInventoryRow[]; unmappedColumns: string[] }> {
  const xai = getXai();
  const allParsed: ParsedInventoryRow[] = [];
  let unmappedColumns: string[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);

    const { object } = await generateObject({
      model: xai('grok-4-1-fast-non-reasoning'),
      schema: inventoryBatchSchema,
      prompt: `You are parsing truck/trailer/heavy equipment inventory data for a commercial vehicle marketplace.

Source system: ${detectedSource}
Column mapping: ${JSON.stringify(columnMapping)}

Parse these ${chunk.length} rows into structured inventory records. Apply the column mapping to normalize field names.

Rules:
- title: if missing, synthesize from year + make + model (e.g. "2019 Peterbilt 389")
- category: infer from make/model/type. Use slugs: heavy-duty-trucks, trailers, lowboys, flatbeds, reefers, dump-trucks, construction-equipment, semi-trucks. Default to "trailers" if unclear.
- condition: normalize to: new, excellent, good, fair, salvage. Map: "used" → "good", "certified" → "excellent", "poor" → "fair"
- price: strip $ signs, commas. Convert "50k" → 50000. null if not present.
- mileage/hours: extract numbers only. null if not present.
- vin: preserve exact value, max 17 chars
- state: normalize to 2-letter abbreviation (e.g. "Texas" → "TX")
- year: must be 4-digit integer between 1990 and ${currentYear + 2}

Per-row confidence: 0.9+ = all key fields present, 0.6-0.9 = some missing, <0.6 = likely garbage
Per-row issues: list data quality warnings (e.g. "price missing", "VIN invalid")

Raw data:
${JSON.stringify(chunk, null, 2)}`,
    });

    allParsed.push(...object.rows);
    if (object.unmappedColumns.length > 0) {
      unmappedColumns = object.unmappedColumns;
    }

    logger.info(`Smart Import: parsed inventory chunk ${i / CHUNK_SIZE + 1}, ${chunk.length} rows`);
  }

  return { parsed: allParsed, unmappedColumns };
}

export async function parseCRMBatch(
  rows: Record<string, string>[],
  columnMapping: Record<string, string>,
  detectedSource: string,
): Promise<{ parsed: ParsedCRMRow[]; unmappedColumns: string[] }> {
  const xai = getXai();
  const allParsed: ParsedCRMRow[] = [];
  let unmappedColumns: string[] = [];

  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    const chunk = rows.slice(i, i + CHUNK_SIZE);

    const { object } = await generateObject({
      model: xai('grok-4-1-fast-non-reasoning'),
      schema: crmBatchSchema,
      prompt: `You are parsing CRM contact/lead data for a commercial truck/trailer dealership.

Source system: ${detectedSource}
Column mapping: ${JSON.stringify(columnMapping)}

Parse these ${chunk.length} rows into structured CRM contact records. Apply the column mapping.

Rules:
- name: required — combine first_name + last_name if separate columns
- email: validate format, lowercase
- phone: preserve as-is, include area code
- company: company or organization name
- status: map to: new, contacted, qualified, proposal, won, lost. Default: "new"
- source: if from Salesforce → "website", if from HubSpot → "website", otherwise → "manual"
- deal_value: strip $ signs, commas. Convert "50k" → 50000. Default 0.
- notes: combine any extra info, comments, or description fields

Per-row confidence: 0.9+ = name + at least email or phone present, 0.6-0.9 = name only, <0.6 = garbage
Per-row issues: list data quality warnings

Raw data:
${JSON.stringify(chunk, null, 2)}`,
    });

    allParsed.push(...object.rows);
    if (object.unmappedColumns.length > 0) {
      unmappedColumns = object.unmappedColumns;
    }

    logger.info(`Smart Import: parsed CRM chunk ${i / CHUNK_SIZE + 1}, ${chunk.length} rows`);
  }

  return { parsed: allParsed, unmappedColumns };
}

// --- Document Analysis ---

export async function analyzeDocument(
  textContent: string,
  fileName: string,
): Promise<DocumentAnalysis> {
  const xai = getXai();

  const snippet = textContent.slice(0, 8000);

  const { object } = await generateObject({
    model: xai('grok-4-1-fast-non-reasoning'),
    schema: documentAnalysisSchema,
    prompt: `You are analyzing a document uploaded by a commercial truck/trailer dealer.

File name: ${fileName}

Document content (first 8000 chars):
${snippet}

Determine:
1. A clear, concise title for this document
2. The best category: spec_sheet, warranty, policy, brochure, price_list, or general
3. A brief 1-2 sentence summary`,
  });

  return object;
}

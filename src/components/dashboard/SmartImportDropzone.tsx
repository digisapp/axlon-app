'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Upload,
  FileSpreadsheet,
  FileText,
  File as FileIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { csrfFetch } from '@/lib/csrf-fetch';

// Types matching the API response
interface ParsedRow {
  title?: string;
  category?: string;
  price?: number;
  condition?: string;
  year?: number;
  make?: string;
  model?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  deal_value?: number;
  confidence: number;
  issues: string[];
  [key: string]: unknown;
}

interface DocumentPreview {
  suggestedTitle: string;
  suggestedType: string;
  summary: string;
}

interface SmartImportPreview {
  detectedType: 'inventory' | 'crm_contacts' | 'document' | 'unknown';
  detectedSource: string;
  confidence: number;
  totalRows: number;
  validRows: number;
  warningRows: number;
  columnMapping: Record<string, string>;
  previewRows: ParsedRow[];
  allRows: ParsedRow[];
  unmappedColumns: string[];
  fileName: string;
  documentPreview?: DocumentPreview;
}

type ImportStep = 'idle' | 'uploading' | 'preview' | 'importing' | 'complete' | 'error';

interface ImportResult {
  success: number;
  failed: number;
  failedRows: { row: number; reason: string }[];
}

interface SmartImportDropzoneProps {
  compact?: boolean;
  onComplete?: () => void;
}

export function SmartImportDropzone({ compact, onComplete }: SmartImportDropzoneProps) {
  const [step, setStep] = useState<ImportStep>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<SmartImportPreview | null>(null);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMapping, setShowMapping] = useState(false);
  const [showFailedRows, setShowFailedRows] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep('idle');
    setIsDragging(false);
    setFile(null);
    setPreview(null);
    setProgress(0);
    setImportResult(null);
    setError(null);
    setShowMapping(false);
    setShowFailedRows(false);
  }, []);

  const handleFileSelected = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setStep('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await csrfFetch('/api/dashboard/smart-import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Failed to analyze file');
        setStep('error');
        return;
      }

      const data: SmartImportPreview = await response.json();
      setPreview(data);
      setStep('preview');
    } catch {
      setError('Network error. Please try again.');
      setStep('error');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelected(droppedFile);
  }, [handleFileSelected]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelected(selectedFile);
  }, [handleFileSelected]);

  const handleRetryWithHint = useCallback(async (hint: 'inventory' | 'crm') => {
    if (!file) return;
    setStep('uploading');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('hint', hint);

      const response = await csrfFetch('/api/dashboard/smart-import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Failed to analyze file');
        setStep('error');
        return;
      }

      const data: SmartImportPreview = await response.json();
      setPreview(data);
      setStep('preview');
    } catch {
      setError('Network error. Please try again.');
      setStep('error');
    }
  }, [file]);

  const executeImport = useCallback(async () => {
    if (!preview) return;
    setStep('importing');
    setProgress(0);

    const rows = preview.allRows;
    let successCount = 0;
    let failedCount = 0;
    const failedRows: { row: number; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        let endpoint = '';
        let body: Record<string, unknown> = {};

        if (preview.detectedType === 'inventory') {
          endpoint = '/api/dashboard/bulk/import';
          body = {
            title: row.title || `${row.year || ''} ${row.make || ''} ${row.model || ''}`.trim() || 'Untitled Listing',
            category: row.category || 'trailers',
            price: row.price || 0,
            condition: row.condition || 'good',
            year: row.year,
            make: row.make,
            model: row.model,
            vin: row.vin,
            mileage: row.mileage,
            hours: row.hours,
            description: row.description,
            city: row.city,
            state: row.state,
            stock_number: row.stock_number,
            acquisition_cost: row.acquisition_cost,
          };
        } else if (preview.detectedType === 'crm_contacts') {
          endpoint = '/api/dashboard/crm';
          body = {
            name: row.name || 'Unknown Contact',
            email: row.email || '',
            phone: row.phone || '',
            company: row.company || '',
            status: row.status || 'new',
            source: row.source || 'manual',
            notes: row.notes || '',
            deal_value: row.deal_value || 0,
          };
        }

        if (!endpoint) {
          failedCount++;
          failedRows.push({ row: i + 1, reason: 'Unknown data type' });
          continue;
        }

        const res = await csrfFetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          successCount++;
        } else {
          failedCount++;
          const err = await res.json().catch(() => ({ error: 'Unknown error' }));
          failedRows.push({ row: i + 1, reason: err.error || 'Import failed' });
        }
      } catch {
        failedCount++;
        failedRows.push({ row: i + 1, reason: 'Network error' });
      }

      setProgress(((i + 1) / rows.length) * 100);
    }

    setImportResult({ success: successCount, failed: failedCount, failedRows });
    setStep('complete');
    onComplete?.();
  }, [preview, onComplete]);

  const executeDocumentImport = useCallback(async () => {
    if (!preview?.documentPreview || !file) return;
    setStep('importing');
    setProgress(50);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', preview.documentPreview.suggestedTitle);
      formData.append('document_type', preview.documentPreview.suggestedType);

      const res = await csrfFetch('/api/dealer/knowledge-base/documents', {
        method: 'POST',
        body: formData,
      });

      setProgress(100);

      if (res.ok) {
        setImportResult({ success: 1, failed: 0, failedRows: [] });
      } else {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        setImportResult({ success: 0, failed: 1, failedRows: [{ row: 1, reason: err.error }] });
      }
      setStep('complete');
      onComplete?.();
    } catch {
      setError('Failed to upload document');
      setStep('error');
    }
  }, [preview, file, onComplete]);

  // --- Render ---

  // Idle: Drop zone
  if (step === 'idle') {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg transition-all cursor-pointer
          ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}
          ${compact ? 'p-6' : 'p-8 md:p-12'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls,.pdf,.txt,.json,.docx,.md"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`rounded-full bg-primary/10 flex items-center justify-center ${compact ? 'w-10 h-10' : 'w-14 h-14'}`}>
            <Upload className={`text-primary ${compact ? 'w-5 h-5' : 'w-7 h-7'}`} />
          </div>
          <div>
            <p className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>
              {isDragging ? 'Drop your file here' : 'Drop any file to import'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              CSV, Excel, PDF, JSON, TXT — AI auto-detects your data
            </p>
          </div>
          {!compact && (
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4" />
                <span>CSV</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <FileIcon className="w-4 h-4" />
                <span>PDF</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Uploading: Analyzing state
  if (step === 'uploading') {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${compact ? 'py-8' : 'py-12'}`}>
        <div className="relative">
          <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <div className="text-center">
          <p className="font-semibold">Analyzing your file...</p>
          <p className="text-xs text-muted-foreground mt-1">
            AI is detecting data type and mapping columns
          </p>
        </div>
        <div className="w-48">
          <Progress value={33} className="h-1.5 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (step === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <XCircle className="w-10 h-10 text-destructive" />
        <div className="text-center">
          <p className="font-semibold">Import Failed</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/bulk">Manual CSV Import</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Preview state
  if (step === 'preview' && preview) {
    // Unknown type — let dealer choose
    if (preview.detectedType === 'unknown') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <p className="font-semibold">Couldn&apos;t auto-detect data type</p>
          </div>
          <p className="text-sm text-muted-foreground">
            What does <span className="font-medium">{preview.fileName}</span> contain?
          </p>
          <div className="flex gap-3">
            <Button onClick={() => handleRetryWithHint('inventory')} variant="outline">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Inventory / Listings
            </Button>
            <Button onClick={() => handleRetryWithHint('crm')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              CRM Contacts
            </Button>
            <Button onClick={reset} variant="ghost" size="sm">Cancel</Button>
          </div>
        </div>
      );
    }

    // Document preview
    if (preview.detectedType === 'document' && preview.documentPreview) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileIcon className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Document Detected</span>
            </div>
            <Badge variant="outline">{preview.documentPreview.suggestedType.replace('_', ' ')}</Badge>
          </div>
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="font-medium text-sm">{preview.documentPreview.suggestedTitle}</p>
              <p className="text-xs text-muted-foreground">{preview.documentPreview.summary}</p>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">
            This will be added to your AI Knowledge Base so your AI assistant can reference it.
          </p>
          <div className="flex gap-2">
            <Button onClick={executeDocumentImport}>
              <Sparkles className="w-4 h-4 mr-2" />
              Add to Knowledge Base
            </Button>
            <Button variant="ghost" onClick={reset}>Cancel</Button>
          </div>
        </div>
      );
    }

    // Inventory or CRM preview
    const typeLabel = preview.detectedType === 'inventory' ? 'inventory listings' : 'CRM contacts';
    const inventoryHeaders = ['Title', 'Category', 'Price', 'Condition', 'Year', 'Make'];
    const crmHeaders = ['Name', 'Email', 'Phone', 'Company', 'Deal Value'];
    const headers = preview.detectedType === 'inventory' ? inventoryHeaders : crmHeaders;

    return (
      <div className="space-y-4">
        {/* Detection summary */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-semibold">
              Found {preview.totalRows} {typeLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {preview.detectedSource}
            </Badge>
            <Badge
              variant={preview.confidence >= 0.8 ? 'default' : 'secondary'}
              className="text-xs"
            >
              {Math.round(preview.confidence * 100)}% confident
            </Badge>
          </div>
        </div>

        {/* Quality bar */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {preview.validRows} ready
          </span>
          {preview.warningRows > 0 && (
            <span className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              {preview.warningRows} warnings
            </span>
          )}
          {preview.totalRows - preview.validRows - preview.warningRows > 0 && (
            <span className="flex items-center gap-1 text-red-600">
              <XCircle className="w-3.5 h-3.5" />
              {preview.totalRows - preview.validRows - preview.warningRows} issues
            </span>
          )}
        </div>

        {/* Column mapping (collapsible) */}
        {Object.keys(preview.columnMapping).length > 0 && (
          <button
            onClick={() => setShowMapping(!showMapping)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showMapping ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Column mapping ({Object.keys(preview.columnMapping).length} mapped)
          </button>
        )}
        {showMapping && (
          <div className="grid grid-cols-2 gap-1 text-xs bg-muted/50 rounded-lg p-3">
            {Object.entries(preview.columnMapping).map(([from, to]) => (
              <div key={from} className="flex items-center gap-1.5">
                <span className="text-muted-foreground truncate">{from}</span>
                <ArrowRight className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium truncate">{to}</span>
              </div>
            ))}
          </div>
        )}

        {/* Unmapped columns warning */}
        {preview.unmappedColumns.length > 0 && (
          <p className="text-xs text-amber-600">
            Skipped columns: {preview.unmappedColumns.join(', ')}
          </p>
        )}

        {/* Preview table */}
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium w-8">#</th>
                {headers.map(h => (
                  <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                ))}
                <th className="px-3 py-2 text-left font-medium w-16">Status</th>
              </tr>
            </thead>
            <tbody>
              {preview.previewRows.map((row, i) => (
                <tr key={i} className={`border-b last:border-0 ${row.confidence < 0.6 ? 'bg-amber-50' : ''}`}>
                  <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                  {preview.detectedType === 'inventory' ? (
                    <>
                      <td className="px-3 py-2 truncate max-w-[150px]">{row.title || '—'}</td>
                      <td className="px-3 py-2">{row.category || '—'}</td>
                      <td className="px-3 py-2">{row.price ? `$${row.price.toLocaleString()}` : '—'}</td>
                      <td className="px-3 py-2">{row.condition || '—'}</td>
                      <td className="px-3 py-2">{row.year || '—'}</td>
                      <td className="px-3 py-2">{row.make || '—'}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2 truncate max-w-[150px]">{row.name || '—'}</td>
                      <td className="px-3 py-2 truncate max-w-[150px]">{row.email || '—'}</td>
                      <td className="px-3 py-2">{row.phone || '—'}</td>
                      <td className="px-3 py-2 truncate max-w-[120px]">{row.company || '—'}</td>
                      <td className="px-3 py-2">{row.deal_value ? `$${row.deal_value.toLocaleString()}` : '—'}</td>
                    </>
                  )}
                  <td className="px-3 py-2">
                    {row.confidence >= 0.8 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : row.confidence >= 0.6 ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview.totalRows > 10 && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted/30">
              Showing 10 of {preview.totalRows} rows
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={executeImport}>
            <Sparkles className="w-4 h-4 mr-2" />
            Import {preview.validRows} {preview.detectedType === 'inventory' ? 'Listings' : 'Contacts'}
          </Button>
          <Button variant="ghost" onClick={reset}>Cancel</Button>
        </div>
      </div>
    );
  }

  // Importing state
  if (step === 'importing') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <div className="text-center">
          <p className="font-semibold">Importing...</p>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(progress)}% complete
          </p>
        </div>
        <div className="w-64">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    );
  }

  // Complete state
  if (step === 'complete' && importResult) {
    const isInventory = preview?.detectedType === 'inventory';
    const isDocument = preview?.detectedType === 'document';
    const destination = isDocument
      ? '/dashboard/ai-assistant'
      : isInventory
        ? '/dashboard/listings'
        : '/dashboard/crm';
    const destinationLabel = isDocument
      ? 'Knowledge Base'
      : isInventory
        ? 'Listings'
        : 'CRM';

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        {importResult.failed === 0 ? (
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        ) : (
          <AlertTriangle className="w-12 h-12 text-amber-500" />
        )}
        <div className="text-center">
          <p className="font-semibold">
            {importResult.success > 0 ? 'Import Complete' : 'Import Failed'}
          </p>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm">
            {importResult.success > 0 && (
              <span className="text-green-600 font-medium">
                {importResult.success} imported
              </span>
            )}
            {importResult.failed > 0 && (
              <span className="text-red-600 font-medium">
                {importResult.failed} failed
              </span>
            )}
          </div>
        </div>

        {/* Failed rows detail */}
        {importResult.failed > 0 && (
          <div className="w-full max-w-md">
            <button
              onClick={() => setShowFailedRows(!showFailedRows)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {showFailedRows ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              View failed rows
            </button>
            {showFailedRows && (
              <div className="mt-2 space-y-1 text-xs max-h-40 overflow-y-auto">
                {importResult.failedRows.map((fr, i) => (
                  <div key={i} className="flex items-start gap-2 text-red-600 bg-red-50 rounded px-2 py-1">
                    <span className="font-medium shrink-0">Row {fr.row}:</span>
                    <span>{fr.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild>
            <Link href={destination}>
              View {destinationLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Import More
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

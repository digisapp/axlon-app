import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadFileToCollection } from '@/lib/ai/collections';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// GET - List dealer's custom documents
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: documents, error } = await supabase
    .from('dealer_kb_documents')
    .select('*')
    .eq('dealer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }

  return NextResponse.json({ data: documents });
}

// POST - Upload a document
export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimitResult = await checkRateLimit(identifier, {
    ...RATE_LIMITS.standard,
    prefix: 'ratelimit:kb-doc-upload',
  });
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult);
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get KB settings
  const { data: settings } = await supabase
    .from('dealer_ai_settings')
    .select('xai_collection_id, xai_collection_status, knowledge_base_enabled')
    .eq('dealer_id', user.id)
    .single();

  if (!settings?.knowledge_base_enabled || settings.xai_collection_status !== 'active' || !settings.xai_collection_id) {
    return NextResponse.json({ error: 'Knowledge base not active' }, { status: 400 });
  }

  // Parse multipart form data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string | null;
  const description = formData.get('description') as string | null;
  const documentType = (formData.get('document_type') as string) || 'general';

  if (!file) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
  }

  const validDocTypes = ['spec_sheet', 'warranty', 'policy', 'brochure', 'price_list', 'general'];
  if (!validDocTypes.includes(documentType)) {
    return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
  }

  try {
    // Create DB record first (pending status)
    const { data: doc, error: insertError } = await supabase
      .from('dealer_kb_documents')
      .insert({
        dealer_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        document_type: documentType,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        upload_status: 'uploading',
      })
      .select()
      .single();

    if (insertError || !doc) {
      logger.error('Failed to create KB document record', { error: insertError });
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }

    // Upload to Supabase storage
    const storagePath = `${user.id}/${doc.id}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: storageError } = await supabase.storage
      .from('dealer-documents')
      .upload(storagePath, fileBuffer, { contentType: file.type });

    if (storageError) {
      logger.error('Storage upload failed', { error: storageError });
      await supabase
        .from('dealer_kb_documents')
        .update({ upload_status: 'error', upload_error: 'Storage upload failed' })
        .eq('id', doc.id);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Upload to xAI collection
    try {
      const { file_id } = await uploadFileToCollection(
        settings.xai_collection_id,
        fileBuffer,
        file.name,
        file.type
      );

      await supabase
        .from('dealer_kb_documents')
        .update({
          xai_file_id: file_id,
          storage_path: storagePath,
          upload_status: 'synced',
          upload_error: null,
        })
        .eq('id', doc.id);

      return NextResponse.json({
        data: { ...doc, xai_file_id: file_id, storage_path: storagePath, upload_status: 'synced' },
      });
    } catch (xaiError) {
      logger.error('xAI upload failed', { error: xaiError });
      await supabase
        .from('dealer_kb_documents')
        .update({
          storage_path: storagePath,
          upload_status: 'error',
          upload_error: xaiError instanceof Error ? xaiError.message : 'xAI upload failed',
        })
        .eq('id', doc.id);
      return NextResponse.json({ error: 'Failed to sync document to AI' }, { status: 500 });
    }
  } catch (error) {
    logger.error('Document upload error', { error });
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

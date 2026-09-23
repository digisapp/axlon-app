import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadDocumentSchema } from '@/lib/validations/deals';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { requireCsrf } from '@/lib/security/csrf';
import { enforceFeature } from '@/lib/entitlements';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - List documents for a deal
// Deal paperwork lives in a private bucket; links are signed for a year so a
// stored URL keeps working for the life of the deal.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365;

const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  'pdf', 'png', 'jpg', 'jpeg', 'webp', 'heic', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt',
]);

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:deal-desk-documents',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gateError = await enforceFeature(supabase, user.id, 'dealDesk');
    if (gateError) return gateError;
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;


    // Verify deal belongs to user
    const { data: deal } = await supabase
      .from('deals')
      .select('id')
      .eq('id', id)
      .eq('dealer_id', user.id)
      .single();

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('deal_documents')
      .select('*')
      .eq('deal_id', id)
      .eq('is_current', true)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching documents', { error });
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    logger.error('Documents error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Upload a document
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:deal-desk-documents',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gateError = await enforceFeature(supabase, user.id, 'dealDesk');
    if (gateError) return gateError;
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;


    // Verify deal belongs to user
    const { data: deal } = await supabase
      .from('deals')
      .select('id, deal_number')
      .eq('id', id)
      .eq('dealer_id', user.id)
      .single();

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = formData.get('document_type') as string;
    const title = formData.get('title') as string;
    const requiresSignature = formData.get('requires_signature') === 'true';

    // Validate input
    const parseResult = uploadDocumentSchema.safeParse({
      document_type: documentType,
      title,
      requires_signature: requiresSignature,
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.issues },
        { status: 400 }
      );
    }

    let fileUrl = null;
    let fileName = null;
    let fileSize = null;
    let mimeType = null;

    // Upload file if provided
    if (file) {
      // No size or type guard existed: any size upload was streamed into
      // storage, and a client-chosen extension/Content-Type (e.g. .html,
      // text/html) was stored verbatim and served back via the signed URL.
      if (file.size > MAX_DOCUMENT_BYTES) {
        return NextResponse.json({ error: 'File too large (max 25MB)' }, { status: 413 });
      }
      const fileExt = (file.name.split('.').pop() || '').toLowerCase();
      if (!ALLOWED_DOCUMENT_EXTENSIONS.has(fileExt)) {
        return NextResponse.json(
          { error: 'Unsupported file type. Upload a PDF, image, Word or Excel document.' },
          { status: 400 }
        );
      }
      const filePath = `deal-documents/${user.id}/${id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        logger.error('Error uploading file', { error: uploadError });
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
      }

      // Signed URL, not public: the `documents` bucket is private as of
      // migration 072 (deal paperwork was readable by anyone with the URL).
      const { data: urlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS);

      fileUrl = urlData?.signedUrl ?? null;
      fileName = file.name;
      fileSize = file.size;
      mimeType = file.type;
    }

    // Mark previous versions as not current
    await supabase
      .from('deal_documents')
      .update({ is_current: false })
      .eq('deal_id', id)
      .eq('document_type', documentType);

    // Get latest version number
    const { data: versions } = await supabase
      .from('deal_documents')
      .select('version')
      .eq('deal_id', id)
      .eq('document_type', documentType)
      .order('version', { ascending: false })
      .limit(1);

    const newVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

    // Create document record
    const { data, error } = await supabase
      .from('deal_documents')
      .insert({
        deal_id: id,
        document_type: documentType,
        title,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        requires_signature: requiresSignature,
        signature_status: requiresSignature ? 'pending' : 'none',
        version: newVersion,
        is_current: true,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating document', { error });
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }

    // Log activity
    await supabase
      .from('deal_activities')
      .insert({
        deal_id: id,
        activity_type: 'document_uploaded',
        title: `Document uploaded: ${title}`,
        description: `${documentType} - Version ${newVersion}`,
        document_id: data.id,
        performed_by: user.id,
      });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    logger.error('Upload document error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

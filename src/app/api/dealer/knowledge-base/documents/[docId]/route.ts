import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { deleteFileFromCollection } from '@/lib/ai/collections';
import { logger } from '@/lib/logger';

// DELETE - Remove a custom document
export const DELETE = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const docId = segments[segments.indexOf('documents') + 1];

  // Get the document (verify ownership)
  const { data: doc } = await supabase
    .from('dealer_kb_documents')
    .select('id, xai_file_id, storage_path, dealer_id')
    .eq('id', docId)
    .eq('dealer_id', user.id)
    .single();

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // Get collection ID
  const { data: settings } = await supabase
    .from('dealer_ai_settings')
    .select('xai_collection_id')
    .eq('dealer_id', user.id)
    .single();

  // Remove from xAI collection
  if (doc.xai_file_id && settings?.xai_collection_id) {
    try {
      await deleteFileFromCollection(settings.xai_collection_id, doc.xai_file_id);
    } catch (error) {
      logger.warn('Failed to delete file from xAI', { error, fileId: doc.xai_file_id });
    }
  }

  // Remove from storage
  if (doc.storage_path) {
    await supabase.storage.from('dealer-documents').remove([doc.storage_path]);
  }

  // Delete DB record
  const { error } = await supabase
    .from('dealer_kb_documents')
    .delete()
    .eq('id', docId);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:kb-documents' } });

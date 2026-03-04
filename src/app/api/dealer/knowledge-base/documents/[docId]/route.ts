import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteFileFromCollection } from '@/lib/ai/collections';
import { logger } from '@/lib/logger';

// DELETE - Remove a custom document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get the document (RLS ensures ownership)
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
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { requireCsrf } from '@/lib/security/csrf';

const patchSchema = z.object({
  status: z.enum(['prospect', 'scoping', 'active', 'maintenance', 'churned']).optional(),
  current_phase: z.number().int().min(1).max(4).optional(),
  monthly_rate: z.number().int().min(0).optional(),
  ai_systems_live: z.array(z.string()).optional(),
  ai_systems_pending: z.array(z.string()).optional(),
  next_milestone: z.string().max(200).nullable().optional(),
  next_milestone_date: z.string().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  contact_name: z.string().max(100).optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(30).nullable().optional(),
}).passthrough();

const milestoneSchema = z.object({
  milestone_id: z.string().uuid(),
  status: z.enum(['pending', 'in_progress', 'complete']),
});

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single();
  return profile?.is_admin ? user : null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!await requireAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await params;
    const { data, error } = await supabase
      .from('consulting_clients')
      .select('*, milestones:consulting_milestones(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error fetching client', { error });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!await requireAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const { id } = await params;
    const body = await request.json();

    // Handle milestone status update separately
    if (body.milestone_id) {
      const parsed = milestoneSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
      }
      const updateData: Record<string, unknown> = { status: parsed.data.status };
      if (parsed.data.status === 'complete') updateData.completed_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('consulting_milestones')
        .update(updateData)
        .eq('id', parsed.data.milestone_id)
        .eq('client_id', id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    // Regular client update
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('consulting_clients')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error updating client', { error });
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!await requireAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await params;
    const { error } = await supabase
      .from('consulting_clients')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting client', { error });
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

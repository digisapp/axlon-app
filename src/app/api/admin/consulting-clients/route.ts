import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { requireCsrf } from '@/lib/security/csrf';

const clientSchema = z.object({
  company_name: z.string().min(1).max(200),
  vertical: z.enum([
    'Heavy Haul / Lowboy Carrier',
    'Equipment Dealer',
    'Crane & Rigging',
    'Regional Fleet Operator',
    'Equipment Rental',
    'Specialized Transport',
    'Other',
  ]),
  contact_name: z.string().min(1).max(100),
  contact_email: z.string().email(),
  contact_phone: z.string().max(30).optional().nullable(),
  contact_title: z.string().max(100).optional().nullable(),
  monthly_rate: z.number().int().min(1000).max(50000),
  contract_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contract_end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scoping_fee: z.number().int().min(0).optional().default(0),
  status: z.enum(['prospect', 'scoping', 'active', 'maintenance', 'churned']).default('active'),
  current_phase: z.number().int().min(1).max(4).default(1),
  ai_systems_live: z.array(z.string()).optional().default([]),
  ai_systems_pending: z.array(z.string()).optional().default([]),
  next_milestone: z.string().max(200).optional().nullable(),
  next_milestone_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  acquisition_source: z.enum([
    'scra-outreach', 'conexpo-outreach', 'referral', 'inbound', 'cold-email', 'linkedin', 'other',
  ]).optional().nullable(),
});

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  return profile?.is_admin ? user : null;
}

export async function GET() {
  try {
    const supabase = await createClient();
    if (!await requireAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('consulting_clients')
      .select(`
        *,
        milestones:consulting_milestones(id, title, status, due_date, phase)
      `)
      .order('contract_start', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Error fetching consulting clients', { error });
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!await requireAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const body = await request.json();
    const parsed = clientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('consulting_clients')
      .insert(parsed.data)
      .select()
      .single();

    if (error) throw error;

    // Auto-create default milestones based on phase
    const defaultMilestones = [
      { title: 'Business audit & AI opportunity mapping', phase: 1, due_date: addDays(parsed.data.contract_start, 14) },
      { title: 'AI Lead Response System live', phase: 1, due_date: addDays(parsed.data.contract_start, 45) },
      { title: 'CRM integration complete', phase: 1, due_date: addDays(parsed.data.contract_start, 60) },
      { title: 'Document AI processing live', phase: 1, due_date: addDays(parsed.data.contract_start, 90) },
      { title: 'Dispatch / Load Matching system live', phase: 2, due_date: addDays(parsed.data.contract_start, 150) },
      { title: 'Automated quoting engine live', phase: 2, due_date: addDays(parsed.data.contract_start, 180) },
      { title: 'Axlon Marketplace integration complete', phase: 3, due_date: addDays(parsed.data.contract_start, 270) },
      { title: 'AI-Ready Dealer Certification issued', phase: 3, due_date: addDays(parsed.data.contract_start, 330) },
      { title: 'Year-end review + renewal discussion', phase: 3, due_date: addDays(parsed.data.contract_start, 355) },
    ];

    await supabase.from('consulting_milestones').insert(
      defaultMilestones.map(m => ({ ...m, client_id: data.id, status: 'pending' }))
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    logger.error('Error creating consulting client', { error });
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

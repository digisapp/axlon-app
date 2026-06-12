import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit'
import { logger } from '@/lib/logger'
import { requireCsrf } from '@/lib/security/csrf'
import { z } from 'zod'

const aiAgentSettingsSchema = z.object({
  voice: z.enum(['Ara', 'Eve', 'Mika', 'Leo', 'Rex', 'Sal']).optional(),
  agent_name: z.string().min(1).max(100).optional(),
  greeting_message: z.string().max(1000).optional(),
  instructions: z.string().max(5000).optional(),
  model: z.string().max(100).optional(),
  temperature: z.number().min(0).max(2).optional(),
  phone_number: z.string().max(20).nullable().optional(),
  is_active: z.boolean().optional(),
})

// GET - Fetch AI agent settings
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = await checkRateLimit(identifier, {
    ...RATE_LIMITS.standard,
    prefix: 'ratelimit:admin:ai-agent',
  })

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  // Get settings (there's only one row)
  const { data, error } = await supabase
    .from('ai_agent_settings')
    .select('*')
    .single()

  if (error) {
    logger.error('Error fetching AI agent settings', { error })
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// PUT - Update AI agent settings
export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = await checkRateLimit(identifier, {
    ...RATE_LIMITS.standard,
    prefix: 'ratelimit:admin:ai-agent',
  })

  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult)
  }

  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const csrfError = await requireCsrf(request)
  if (csrfError) return csrfError

  const body = await request.json()
  const parsed = aiAgentSettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid settings', details: parsed.error.issues }, { status: 400 })
  }

  // Update settings
  const { data, error } = await supabase
    .from('ai_agent_settings')
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .select()
    .single()

  if (error) {
    logger.error('Error updating AI agent settings', { error })
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }

  return NextResponse.json(data)
}

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, updateStaffSchema } from '@/lib/validations/api';
import crypto from 'crypto';

function hashPin(pin: string, salt: string): string {
  const data = `${salt}:${pin}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// GET - Get single staff member
export const GET = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('staff') + 1];

  const { data: staff, error } = await supabase
    .from('dealer_staff')
    .select('*')
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (error || !staff) {
    return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...staff,
      voice_pin: staff.voice_pin ? '**' + staff.voice_pin.slice(-2) : '****',
      pin_hash: undefined,
    },
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dealer-staff' } });

// PATCH - Update staff member
export const PATCH = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('staff') + 1];

  // Verify ownership
  const { data: existing } = await supabase
    .from('dealer_staff')
    .select('id')
    .eq('id', id)
    .eq('dealer_id', user.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
  }

  const body = await request.json();

  let validatedData;
  try {
    validatedData = validateBody(updateStaffSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }

  // Build update object from validated data
  const updateData: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(validatedData)) {
    if (value !== undefined && field !== 'voice_pin') {
      updateData[field] = value;
    }
  }
  // Also allow is_active from body (not in updateStaffSchema)
  if (body.is_active !== undefined) {
    updateData.is_active = body.is_active;
  }

  // If updating PIN, hash with staff ID as salt (matches verify route)
  if (validatedData.voice_pin) {
    updateData.pin_hash = hashPin(validatedData.voice_pin, id);
    updateData.voice_pin = null; // Clear any legacy plaintext PIN
  }

  const { data: staff, error } = await supabase
    .from('dealer_staff')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    data: {
      ...staff,
      voice_pin: staff.voice_pin ? '**' + staff.voice_pin.slice(-2) : '****',
      pin_hash: undefined,
    },
    message: 'Staff member updated successfully',
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dealer-staff' } });

// DELETE - Remove staff member
export const DELETE = withAuth(async (request, { user, supabase }) => {
  const segments = new URL(request.url).pathname.split('/');
  const id = segments[segments.indexOf('staff') + 1];

  const { error } = await supabase
    .from('dealer_staff')
    .delete()
    .eq('id', id)
    .eq('dealer_id', user.id);

  if (error) throw error;

  return NextResponse.json({ message: 'Staff member removed successfully' });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dealer-staff' } });

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/with-auth';
import { RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { validateBody, ValidationError, createStaffSchema } from '@/lib/validations/api';
import crypto from 'crypto';
import { enforceFeature } from '@/lib/entitlements';

function hashPin(pin: string, salt: string): string {
  const data = `${salt}:${pin}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// GET - List dealer staff
export const GET = withAuth(async (_request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'voiceAgent');
  if (gateError) return gateError;

  // Get all staff for this dealer
  const { data: staff, error } = await supabase
    .from('dealer_staff')
    .select('*')
    .eq('dealer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Mask PINs for security - never expose PIN or hash
  const maskedStaff = staff?.map(s => ({
    ...s,
    voice_pin: s.voice_pin ? '**' + s.voice_pin.slice(-2) : '****',
    pin_hash: undefined,
  }));

  return NextResponse.json({ data: maskedStaff });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dealer-staff' } });

// POST - Add new staff member
export const POST = withAuth(async (request, { user, supabase }) => {
  const gateError = await enforceFeature(supabase, user.id, 'voiceAgent');
  if (gateError) return gateError;

  const body = await request.json();

  let validatedData;
  try {
    validatedData = validateBody(createStaffSchema, body);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    throw err;
  }

  // Create staff member first (we need the ID to salt the PIN hash)
  const { data: staff, error } = await supabase
    .from('dealer_staff')
    .insert({
      dealer_id: user.id,
      name: validatedData.name,
      role: validatedData.role || 'sales',
      phone_number: validatedData.phone_number || null,
      email: validatedData.email || null,
      voice_pin: null,
      access_level: validatedData.access_level || 'standard',
      can_view_costs: validatedData.can_view_costs || false,
      can_view_margins: validatedData.can_view_margins || false,
      can_view_all_leads: validatedData.can_view_all_leads ?? true,
      can_modify_inventory: validatedData.can_modify_inventory || false,
    })
    .select()
    .single();

  if (error) throw error;

  // Hash PIN with staff ID as salt (matches verify route)
  const hashedPin = hashPin(validatedData.voice_pin, staff.id);

  // Store the salted hash in pin_hash column
  await supabase
    .from('dealer_staff')
    .update({ pin_hash: hashedPin })
    .eq('id', staff.id);

  return NextResponse.json({
    data: {
      ...staff,
      voice_pin: undefined,
      pin_hash: undefined,
    },
    message: 'Staff member added successfully',
  });
}, { rateLimit: { ...RATE_LIMITS.standard, prefix: 'ratelimit:dealer-staff' } });

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createFloorPlanAccountSchema } from '@/lib/validations/floor-plan';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitResponse } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';
import { requireCsrf } from '@/lib/security/csrf';
import { enforceFeature } from '@/lib/entitlements';

// GET - List dealer's floor plan accounts
export async function GET(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:floor-plan-accounts',
    });
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gateError = await enforceFeature(supabase, user.id, 'floorPlan');
    if (gateError) return gateError;

    const { data, error } = await supabase
      .from('floor_plan_accounts')
      .select(`
        *,
        provider:floor_plan_providers(id, name, website)
      `)
      .eq('dealer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching floor plan accounts', { error });
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }

    // Get active units count and total floored — single batch query (avoids N+1)
    const accountIds = (data || []).map((a) => a.id);
    const statsMap = new Map<string, { count: number; total: number }>();

    if (accountIds.length > 0) {
      const { data: unitRows } = await supabase
        .from('listing_floor_plans')
        .select('account_id, current_balance')
        .eq('status', 'active')
        .in('account_id', accountIds);

      for (const row of unitRows ?? []) {
        const existing = statsMap.get(row.account_id) ?? { count: 0, total: 0 };
        statsMap.set(row.account_id, {
          count: existing.count + 1,
          total: existing.total + (row.current_balance || 0),
        });
      }
    }

    const accountsWithStats = (data || []).map((account) => {
      const stats = statsMap.get(account.id) ?? { count: 0, total: 0 };
      return {
        ...account,
        active_units_count: stats.count,
        total_floored_amount: stats.total,
      };
    });

    return NextResponse.json({ data: accountsWithStats });
  } catch (error) {
    logger.error('Floor plan accounts error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new floor plan account
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gateError = await enforceFeature(supabase, user.id, 'floorPlan');
    if (gateError) return gateError;

    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier, {
      ...RATE_LIMITS.standard,
      prefix: 'ratelimit:floor-plan',
    });

    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    const body = await request.json();
    const parseResult = createFloorPlanAccountSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('floor_plan_accounts')
      .insert({
        ...parseResult.data,
        dealer_id: user.id,
        available_credit: parseResult.data.credit_limit, // Initially all credit is available
      })
      .select(`
        *,
        provider:floor_plan_providers(id, name)
      `)
      .single();

    if (error) {
      logger.error('Error creating floor plan account', { error });
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    logger.error('Floor plan account creation error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

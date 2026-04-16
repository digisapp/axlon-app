import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { requireCsrf } from '@/lib/security/csrf';

export async function DELETE(request: NextRequest) {
  try {
    const csrfError = await requireCsrf(request);
    if (csrfError) return csrfError;

    // Get the authenticated user
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Use admin client to delete user and cascade data
    const adminClient = createAdminClient();

    // Delete user's storage files (avatars, listing images)
    const { data: files } = await adminClient.storage
      .from('listing-images')
      .list(user.id);

    if (files && files.length > 0) {
      const filePaths = files.map(f => `${user.id}/${f.name}`);
      await adminClient.storage
        .from('listing-images')
        .remove(filePaths);
    }

    // Delete the auth user (RLS cascade will handle profile, listings, etc.)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Delete user error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete account error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

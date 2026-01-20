'use server'

import { createSupabaseServerClient } from './supabase/server';
import { redirect } from 'next/navigation';

/**
 * Server action to log out user
 */
export async function logoutAction() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/login');
}

'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface Path {
    id: string;
    title: string;
    description?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePathInput {
    title: string;
    description?: string;
}

export interface UpdatePathInput {
    title?: string;
    description?: string;
}

/**
 * Get all paths for the current user
 */
export async function getPathsForUser(): Promise<Path[]> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('paths')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return data || [];
}

/**
 * Create a new path
 */
export async function createPath(input: CreatePathInput): Promise<Path | null> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('paths')
        .insert({
            ...input,
            user_id: user.id,
        })
        .select()
        .single();

    return data;
}

/**
 * Get path by ID
 */
export async function getPathById(pathId: string): Promise<Path | null> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('paths')
        .select('*')
        .eq('id', pathId)
        .single();

    return data;
}

/**
 * Update path
 */
export async function updatePath(pathId: string, input: UpdatePathInput): Promise<Path | null> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('paths')
        .update(input)
        .eq('id', pathId)
        .select()
        .single();

    return data;
}

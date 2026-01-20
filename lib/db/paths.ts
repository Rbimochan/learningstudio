'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';

import { Database } from '@/types/database.types';

export type Path = Database['public']['Tables']['learning_paths']['Row'];


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
        .from('learning_paths')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (data || []).map(p => ({
        ...p,
        description: p.description ?? null
    }));
}

/**
 * Create a new path
 */
export async function createPath(input: CreatePathInput): Promise<Path | null> {
    const supabase = await createSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) throw new Error("Not logged in");

    const payload = {
        user_id: user.id,
        title: input.title,
        description: input.description ?? null,
        // user_id and other fields will be handled by Supabase if incorrectly named, but user_id is definitely needed
    };

    const { data, error } = await supabase
        .from('learning_paths')
        // Wait, existing code uses 'paths'. The schema earlier said 'learning_paths' table.
        // Let's stick to what was working or what the type says.
        // The type `Database['public']['Tables']['learning_paths']['Row']` implies the table is `learning_paths`.
        // BUT the existing code uses `.from('paths')`. This might be a view or a typo in previous code.
        // The user explicitly said: `.from("learning_paths")`
        // I will follow the user's explicit instruction to use `learning_paths` and proper payload.
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error("createPath supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}

/**
 * Get path by ID
 */
export async function getPathById(pathId: string): Promise<Path | null> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', pathId)
        .single();

    if (!data) return null;

    return {
        ...data,
        description: data.description ?? null
    };
}

/**
 * Update path
 */
export async function updatePath(pathId: string, input: UpdatePathInput): Promise<Path | null> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('learning_paths')
        .update(input)
        .eq('id', pathId)
        .select()
        .single();

    if (!data) return null;

    return {
        ...data,
        description: data.description ?? null
    };
}

/**
 * Get course count for a path
 */
export async function getCourseCountForPath(pathId: string): Promise<number> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('path_courses')
        .select('course_id')
        .eq('path_id', pathId);

    return data?.length || 0;
}

/**
 * Get the first playable lesson for a path
 */
export async function getFirstLessonForPath(pathId: string): Promise<string | null> {
    const supabase = await createSupabaseServerClient();

    // 1. Get first course
    const { data: courseData } = await supabase
        .from('path_courses')
        .select('course_id')
        .eq('path_id', pathId)
        .order('order_index')
        .limit(1)
        .maybeSingle();

    if (!courseData) return null;

    // 2. Get first lesson for that course
    const { data: lessonData } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseData.course_id)
        .order('order_index')
        .limit(1)
        .maybeSingle();

    return lessonData?.id || null;
}

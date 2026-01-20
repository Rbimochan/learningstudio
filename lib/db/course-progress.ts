'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface CourseProgress {
    id: string;
    user_id: string;
    course_id: string;
    last_lesson_id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Upsert course progress - track the last lesson the user was on
 */
export async function upsertCourseProgress(
    courseId: string,
    lastLessonId: string
): Promise<boolean> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('course_progress')
        .upsert({
            user_id: user.id,
            course_id: courseId,
            last_lesson_id: lastLessonId,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id,course_id'
        });

    return !error;
}

/**
 * Get the last lesson a user was on for a course
 */
export async function getCourseProgress(courseId: string): Promise<CourseProgress | null> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

    return data;
}

/**
 * Get all course progress for current user
 */
export async function getAllCourseProgress(): Promise<CourseProgress[]> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    return data || [];
}

/**
 * Get the lesson to continue for a course
 * Returns the last lesson if it exists, otherwise the first lesson
 */
export async function getContinueLessonId(courseId: string): Promise<string | null> {
    const progress = await getCourseProgress(courseId);
    
    if (progress?.last_lesson_id) {
        return progress.last_lesson_id;
    }

    // If no progress, return first lesson
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId)
        .order('order_index')
        .limit(1)
        .single();

    return data?.id || null;
}

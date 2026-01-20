'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';

export type LessonStatus = 'todo' | 'doing' | 'done';

export interface Progress {
    id: string;
    lesson_id: string;
    user_id: string;
    status: LessonStatus;
    last_position?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Get progress for a lesson
 */
export async function getProgressForLesson(lessonId: string): Promise<Progress | null> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

    return data;
}

/**
 * Set lesson status
 */
export async function setLessonStatus(
    lessonId: string,
    status: LessonStatus
): Promise<boolean> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('progress')
        .upsert({
            lesson_id: lessonId,
            user_id: user.id,
            status,
            updated_at: new Date().toISOString()
        });

    return !error;
}

/**
 * Upsert playback position for a lesson
 */
export async function upsertPlaybackPosition(
    lessonId: string,
    position: number
): Promise<boolean> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
        .from('progress')
        .upsert({
            lesson_id: lessonId,
            user_id: user.id,
            last_position: Math.floor(position),
            status: 'doing',
            updated_at: new Date().toISOString()
        });

    return !error;
}

/**
 * Calculate path progress based on completed lessons
 */
export async function calculatePathProgress(pathId: string): Promise<number> {
    const supabase = await createSupabaseServerClient();

    // Get all courses in the path
    const { data: pathCourses } = await supabase
        .from('path_courses')
        .select('course_id')
        .eq('path_id', pathId);

    if (!pathCourses || pathCourses.length === 0) return 0;

    const courseIds = pathCourses.map(pc => pc.course_id);

    // Get all lessons for these courses
    const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .in('course_id', courseIds);

    if (!lessons || lessons.length === 0) return 0;

    const lessonIds = lessons.map(l => l.id);

    // Get progress for these lessons
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data: progress } = await supabase
        .from('progress')
        .select('status')
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds)
        .eq('status', 'done');

    const completedCount = progress?.length || 0;
    return (completedCount / lessons.length) * 100;
}

/**
 * Get course statistics (lesson count, completed count)
 */
export async function getCourseStats(courseId: string): Promise<{
    lessonCount: number;
    completedCount: number;
}> {
    const supabase = await createSupabaseServerClient();

    const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

    const lessonCount = lessons?.length || 0;

    if (lessonCount === 0) {
        return { lessonCount: 0, completedCount: 0 };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { lessonCount, completedCount: 0 };
    }

    const lessonIds = lessons!.map(l => l.id);

    const { data: progress } = await supabase
        .from('progress')
        .select('status')
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds)
        .eq('status', 'done');

    return {
        lessonCount,
        completedCount: progress?.length || 0
    };
}

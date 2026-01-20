'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { LessonStatus } from './progress';

export interface Lesson {
    id: string;
    title: string;
    type: string;
    source: string;
    course_id: string;
    order_index: number;
}

export interface LessonWithStatus extends Lesson {
    status: LessonStatus;
}

/**
 * Get lessons for a course
 */
export async function getLessonsForCourse(courseId: string): Promise<Lesson[]> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

    return data || [];
}

/**
 * Get lesson by ID with status
 */
export async function getLessonById(lessonId: string): Promise<LessonWithStatus | null> {
    const supabase = await createSupabaseServerClient();

    const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

    if (!lessonData) return null;

    // Get lesson status
    const { data: { user } } = await supabase.auth.getUser();
    let status: LessonStatus = 'todo';

    if (user) {
        const { data: progress } = await supabase
            .from('progress')
            .select('status')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single();

        status = progress?.status || 'todo';
    }

    return { ...lessonData, status };
}

/**
 * Get all lessons for a course with status
 */
export async function getLessonsForCourseWithStatus(courseId: string): Promise<LessonWithStatus[]> {
    const supabase = await createSupabaseServerClient();

    const { data: courseLessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

    if (!courseLessons) return [];

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return courseLessons.map(l => ({ ...l, status: 'todo' as const }));
    }

    // Get status for all lessons
    const lessonsWithStatus = await Promise.all(
        courseLessons.map(async (l) => {
            const { data: prog } = await supabase
                .from('progress')
                .select('status')
                .eq('user_id', user.id)
                .eq('lesson_id', l.id)
                .single();

            return { ...l, status: prog?.status || 'todo' as const };
        })
    );

    return lessonsWithStatus;
}

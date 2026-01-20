'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface Course {
    id: string;
    title: string;
    description?: string;
    created_at: string;
    updated_at: string;
    meta?: {
        level?: string;
        tags?: string[];
    };
}

export interface CreateCourseInput {
    title: string;
    description?: string;
    meta?: {
        level?: string;
        tags?: string[];
    };
}

export interface UpdateCourseInput {
    title?: string;
    description?: string;
    meta?: {
        level?: string;
        tags?: string[];
    };
}

/**
 * Get courses for a path
 */
export async function getCoursesForPath(pathId: string): Promise<Course[]> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('path_courses')
        .select('courses(*)')
        .eq('path_id', pathId)
        .order('order_index');

    if (!data) return [];

    // Extract courses from the nested structure
    return data.map((pc: any) => pc.courses).filter(Boolean);
}

/**
 * Create a course and link it to a path
 */
export async function createCourseAndLinkToPath(
    pathId: string,
    input: CreateCourseInput
): Promise<Course | null> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Create the course
    const { data: course } = await supabase
        .from('courses')
        .insert({
            ...input,
            user_id: user.id
        })
        .select()
        .single();

    if (!course) return null;

    // Get the next order_index for this path
    const { data: existingLinks } = await supabase
        .from('path_courses')
        .select('order_index')
        .eq('path_id', pathId)
        .order('order_index', { ascending: false })
        .limit(1);

    const nextOrderIndex = existingLinks && existingLinks.length > 0
        ? existingLinks[0].order_index + 1
        : 0;

    // Link course to path
    await supabase
        .from('path_courses')
        .insert({
            path_id: pathId,
            course_id: course.id,
            order_index: nextOrderIndex,
        });

    return course;
}

/**
 * Get course by ID
 */
export async function getCourseById(courseId: string): Promise<Course | null> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

    return data;
}

/**
 * Update course
 */
export async function updateCourse(courseId: string, input: UpdateCourseInput): Promise<Course | null> {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
        .from('courses')
        .update(input)
        .eq('id', courseId)
        .select()
        .single();

    return data;
}

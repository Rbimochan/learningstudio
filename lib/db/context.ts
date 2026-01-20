import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface LessonContext {
    pathId: string;
    courseId: string;
    lessonId: string;
    pathTitle?: string;
    courseTitle?: string;
}

/**
 * Get the full context for a lesson (path, course, titles)
 * Uses: lessons → course_id → path_courses → path_id
 * Picks the first linked path by order_index ASC, created_at ASC
 */
export async function getLessonContext(lessonId: string): Promise<LessonContext | null> {
    const supabase = await createSupabaseServerClient();

    // Get lesson and course
    const { data: lesson } = await supabase
        .from('lessons')
        .select('id, course_id, courses(id, title)')
        .eq('id', lessonId)
        .single();

    if (!lesson) return null;

    const courseId = lesson.course_id;
    const courseTitle = (lesson.courses as any)?.title;

    // Get the first linked path (deterministic: order by order_index, then created_at)
    const { data: pathCourse } = await supabase
        .from('path_courses')
        .select('path_id, paths(id, title)')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    if (!pathCourse) return null;

    const pathId = pathCourse.path_id;
    const pathTitle = (pathCourse.paths as any)?.title;

    return {
        pathId,
        courseId,
        lessonId,
        pathTitle,
        courseTitle,
    };
}

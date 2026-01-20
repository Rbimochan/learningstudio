import { createClient } from '@/lib/supabase/client';

/**
 * Calculate path progress based on completed lessons
 */
export async function calculatePathProgress(pathId: string): Promise<number> {
    const supabase = createClient();

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
 * Calculate course progress based on completed lessons
 */
export async function calculateCourseProgress(courseId: string): Promise<number> {
    const supabase = createClient();

    // Get all lessons for this course
    const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

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
 * Get lesson status for current user
 */
export async function getLessonStatus(lessonId: string): Promise<'todo' | 'doing' | 'done'> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 'todo';

    const { data: progress } = await supabase
        .from('progress')
        .select('status')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

    return progress?.status || 'todo';
}

/**
 * Update lesson status for current user
 */
export async function updateLessonStatus(
    lessonId: string,
    status: 'todo' | 'doing' | 'done'
): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase
        .from('progress')
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            status,
            updated_at: new Date().toISOString()
        });

    return !error;
}

/**
 * Get course statistics (lesson count, completed count)
 */
export async function getCourseStats(courseId: string): Promise<{
    lessonCount: number;
    completedCount: number;
}> {
    const supabase = createClient();

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

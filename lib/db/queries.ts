/**
 * Database Query Utilities
 * Centralized database operations with proper typing and error handling
 */

import { createSupabaseServerClient } from '../supabase/server';
import { Database } from '@/types/database.types';

type Tables = Database['public']['Tables'];
type Course = Tables['courses']['Row'];
type Lesson = Tables['lessons']['Row'];
type Progress = Tables['progress']['Row'];
type Note = Tables['notes']['Row'];
type LearningPath = Tables['learning_paths']['Row'];

/**
 * Course Queries
 */
export async function getCoursesByUser(userId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Course[];
}

export async function getCourseById(courseId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
    
    if (error) throw error;
    return data as Course;
}

/**
 * Lesson Queries
 */
export async function getLessonsByCourse(courseId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data as Lesson[];
}

export async function getLessonById(lessonId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
    
    if (error) throw error;
    return data as Lesson;
}

/**
 * Progress Queries
 */
export async function getProgressByUser(userId: string, lessonId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .maybeSingle();
    
    if (error) throw error;
    return data as Progress | null;
}

export async function getAllProgressByUser(userId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);
    
    if (error) throw error;
    return data as Progress[];
}

/**
 * Notes Queries
 */
export async function getNotesByLesson(userId: string, lessonId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data as Note[];
}

/**
 * Learning Path Queries
 */
export async function getLearningPathsByUser(userId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as LearningPath[];
}

export async function getLearningPathById(pathId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('id', pathId)
        .single();
    
    if (error) throw error;
    return data as LearningPath;
}

/**
 * Helper to check if user owns a resource
 */
export async function verifyUserOwnership(
    table: 'courses' | 'learning_paths',
    resourceId: string,
    userId: string
): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from(table)
        .select('user_id')
        .eq('id', resourceId)
        .single();
    
    if (error || !data) return false;
    return data.user_id === userId;
}

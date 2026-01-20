'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface Note {
    id: string;
    lesson_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
}

/**
 * Get notes for a lesson
 */
export async function getNotesForLesson(lessonId: string): Promise<Note | null> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('user_id', user.id)
        .single();

    return data;
}

/**
 * Upsert note for a lesson
 */
export async function upsertNoteForLesson(
    lessonId: string,
    content: string,
    noteId?: string | null
): Promise<Note | null> {
    const supabase = await createSupabaseServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const noteData = {
        lesson_id: lessonId,
        user_id: user.id,
        content,
        updated_at: new Date().toISOString()
    };

    if (noteId) {
        // Update existing note
        const { data } = await supabase
            .from('notes')
            .update(noteData)
            .eq('id', noteId)
            .select()
            .single();

        return data;
    } else {
        // Insert new note
        const { data } = await supabase
            .from('notes')
            .insert(noteData)
            .select()
            .single();

        return data;
    }
}

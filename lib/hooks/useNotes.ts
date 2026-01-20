'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Note = Database['public']['Tables']['notes']['Row']

export function useNotes(lessonId: string) {
    const [note, setNote] = useState<Note | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (lessonId) fetchNote()
    }, [lessonId])

    const fetchNote = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('lesson_id', lessonId)
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error('Error fetching note:', error)
        } else {
            setNote(data)
        }
        setLoading(false)
    }

    const saveNote = async (content: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const payload = {
            lesson_id: lessonId,
            user_id: user.id,
            content,
            updated_at: new Date().toISOString(),
        }

        // Check if we have an ID to update, or if we need to insert
        if (note?.id) {
            const { data, error } = await supabase
                .from('notes')
                .update({ content, updated_at: new Date().toISOString() } as any)
                .eq('id', note.id)
                .select()
                .single()

            if (data) setNote(data)
        } else {
            const { data, error } = await supabase
                .from('notes')
                .insert(payload as any)
                .select()
                .single()

            if (data) setNote(data)
        }
    }

    return { note, loading, saveNote }
}

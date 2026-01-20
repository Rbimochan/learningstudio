'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Lesson = Database['public']['Tables']['lessons']['Row']

export function useLessons(courseId: string) {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (courseId) fetchLessons()
    }, [courseId])

    const fetchLessons = async () => {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching lessons:', error)
        } else {
            setLessons(data || [])
        }
        setLoading(false)
    }

    const createLesson = async (type: 'youtube' | 'pdf' | 'link', title: string, source: string) => {
        const newOrderIndex = lessons.length

        const { data, error } = await supabase
            .from('lessons')
            .insert({
                course_id: courseId,
                type,
                title,
                source,
                order_index: newOrderIndex
            } as any)
            .select()
            .single()

        if (error) {
            console.error('Error creating lesson:', error)
            return null
        }

        setLessons([...lessons, data])
        return data
    }

    const reorderLessons = async (reorderedLessons: Lesson[]) => {
        setLessons(reorderedLessons) // Optimistic update

        const { error } = await supabase
            .from('lessons')
            .upsert(
                reorderedLessons.map(l => ({
                    id: l.id,
                    course_id: l.course_id,
                    type: l.type,
                    title: l.title,
                    source: l.source,
                    order_index: l.order_index
                })) as any
            )

        if (error) console.error('Error reordering lessons:', error)
    }

    return { lessons, loading, createLesson, reorderLessons, refetch: fetchLessons }
}

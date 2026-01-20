'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Course = Database['public']['Tables']['courses']['Row']

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching courses:', error)
        } else {
            setCourses(data || [])
        }
        setLoading(false)
    }

    const createCourse = async (title: string, description?: string): Promise<Course | null> => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('courses')
            .insert({ title, description, user_id: user.id } as any)
            .select()
            .single()

        if (error) {
            console.error('Error creating course:', error)
            return null
        }

        setCourses([data, ...courses])
        return data
    }

    const updateCourse = async (id: string, updates: Partial<Course>) => {
        const { error } = await supabase
            .from('courses')
            .update(updates as any)
            .eq('id', id)

        if (!error) {
            setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c))
        }
    }

    const deleteCourse = async (id: string) => {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id)

        if (!error) {
            setCourses(courses.filter(c => c.id !== id))
        }
    }

    return { courses, loading, createCourse, updateCourse, deleteCourse, refetch: fetchCourses }
}

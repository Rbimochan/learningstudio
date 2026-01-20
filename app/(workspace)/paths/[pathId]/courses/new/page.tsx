'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { CourseForm } from '@/components/courses/CourseForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function NewCoursePage() {
    const router = useRouter();
    const params = useParams();
    const pathId = params.pathId as string;
    const supabase = createClient();

    const handleSubmit = async (data: {
        title: string;
        description: string;
        level: string;
        tags: string[];
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('You must be logged in');
            return;
        }

        // Create course
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert({
                user_id: user.id,
                title: data.title,
                description: data.description || null,
                meta: {
                    level: data.level,
                    tags: data.tags
                }
            })
            .select()
            .single();

        if (courseError || !course) {
            console.error('Error creating course:', courseError);
            alert('Failed to create course');
            return;
        }

        // Get next order_index for this path
        const { data: existingCourses } = await supabase
            .from('path_courses')
            .select('order_index')
            .eq('path_id', pathId)
            .order('order_index', { ascending: false })
            .limit(1);

        const nextOrderIndex = existingCourses && existingCourses.length > 0
            ? existingCourses[0].order_index + 1
            : 0;

        // Link course to path
        const { error: linkError } = await supabase
            .from('path_courses')
            .insert({
                path_id: pathId,
                course_id: course.id,
                order_index: nextOrderIndex
            });

        if (linkError) {
            console.error('Error linking course to path:', linkError);
            alert('Failed to link course to path');
            return;
        }

        // Redirect to course detail
        router.push(`/paths/${pathId}/courses/${course.id}`);
    };

    const handleCancel = () => {
        router.push(`/paths/${pathId}`);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Breadcrumbs
                items={[
                    { label: 'Paths', href: '/paths' },
                    { label: 'Path', href: `/paths/${pathId}` },
                    { label: 'New Course' }
                ]}
            />

            <h1 className="text-3xl font-bold dark:text-white mb-2">Add Course</h1>
            <p className="text-slate-500 mb-8">
                Add a new course to your learning path
            </p>

            <CourseForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                submitLabel="Create Course"
            />
        </div>
    );
}

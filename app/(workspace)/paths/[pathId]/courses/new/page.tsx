'use client';

import { useRouter, useParams } from 'next/navigation';
import { createCourseAndLinkToPath } from '@/lib/db/courses';
import { CourseForm } from '@/components/courses/CourseForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function NewCoursePage() {
    const router = useRouter();
    const params = useParams();
    const pathId = params.pathId as string;

    const handleSubmit = async (data: {
        title: string;
        description: string;
        level: string;
        tags: string[];
    }) => {
        try {
            const course = await createCourseAndLinkToPath(pathId, {
                title: data.title,
                description: data.description || undefined,
                meta: {
                    level: data.level,
                    tags: data.tags
                }
            });

            if (course) {
                // Redirect to course detail
                router.push(`/paths/${pathId}/courses/${course.id}`);
            } else {
                alert('Failed to create course');
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course');
        }
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

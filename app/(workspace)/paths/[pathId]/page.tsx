'use client';

import { Plus, ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CourseList } from '@/components/courses/CourseList';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LoadingState } from '@/components/ui/LoadingState';
import { getCourseStats } from '@/lib/utils/progress';

interface PathData {
    id: string;
    title: string;
    description: string | null;
}

interface CourseWithStats {
    id: string;
    pathId: string;
    title: string;
    description: string | null;
    level?: string;
    tags?: string[];
    lessonCount: number;
    completedCount: number;
}

export default function PathDetailPage() {
    const params = useParams();
    const pathId = params.pathId as string;
    const [path, setPath] = useState<PathData | null>(null);
    const [courses, setCourses] = useState<CourseWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchPathData();
    }, [pathId]);

    async function fetchPathData() {
        setLoading(true);

        // Fetch path data
        const { data: pathData } = await supabase
            .from('learning_paths')
            .select('*')
            .eq('id', pathId)
            .single();

        if (!pathData) {
            setLoading(false);
            return;
        }

        setPath(pathData);

        // Fetch courses in this path
        const { data: pathCourses } = await supabase
            .from('path_courses')
            .select('course_id, order_index')
            .eq('path_id', pathId)
            .order('order_index');

        if (!pathCourses || pathCourses.length === 0) {
            setLoading(false);
            return;
        }

        const courseIds = pathCourses.map(pc => pc.course_id);

        // Fetch course details
        const { data: coursesData } = await supabase
            .from('courses')
            .select('*')
            .in('id', courseIds);

        if (!coursesData) {
            setLoading(false);
            return;
        }

        // Get stats for each course
        const coursesWithStats = await Promise.all(
            coursesData.map(async (course) => {
                const stats = await getCourseStats(course.id);
                const meta = course.meta as any || {};

                return {
                    id: course.id,
                    pathId,
                    title: course.title,
                    description: course.description,
                    level: meta.level,
                    tags: meta.tags || [],
                    lessonCount: stats.lessonCount,
                    completedCount: stats.completedCount
                };
            })
        );

        // Sort by order_index
        const sortedCourses = coursesWithStats.sort((a, b) => {
            const aIndex = pathCourses.find(pc => pc.course_id === a.id)?.order_index || 0;
            const bIndex = pathCourses.find(pc => pc.course_id === b.id)?.order_index || 0;
            return aIndex - bIndex;
        });

        setCourses(sortedCourses);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <LoadingState message="Loading path..." />
            </div>
        );
    }

    if (!path) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <p className="text-center text-slate-500">Path not found</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Breadcrumbs
                items={[
                    { label: 'Paths', href: '/paths' },
                    { label: path.title }
                ]}
            />

            <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold dark:text-white mb-2">{path.title}</h1>
                    {path.description && (
                        <p className="text-slate-500">{path.description}</p>
                    )}
                </div>
                <div className="flex gap-3 ml-4">
                    <Link
                        href={`/paths/${pathId}/edit`}
                        className="px-6 py-3 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                    >
                        <Edit size={18} />
                        Edit Path
                    </Link>
                    <Link
                        href={`/paths/${pathId}/courses/new`}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <Plus size={20} />
                        Add Course
                    </Link>
                </div>
            </div>

            <CourseList courses={courses} pathId={pathId} loading={false} />
        </div>
    );
}

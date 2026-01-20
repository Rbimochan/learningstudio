import { Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CourseList } from '@/components/courses/CourseList';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getPathById } from '@/lib/db/paths';
import { getCoursesForPath } from '@/lib/db/courses';
import { getCourseStats } from '@/lib/db/progress';

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

export default async function PathDetailPage({ params }: { params: Promise<{ pathId: string }> }) {
    const { pathId } = await params;

    // allow parallel fetching
    const pathPromise = getPathById(pathId);
    const coursesPromise = getCoursesForPath(pathId);

    const [path, courses] = await Promise.all([pathPromise, coursesPromise]);

    if (!path) {
        notFound();
    }

    // Sort by order_index (done in getCoursesForPath, but standard lists might not have meta?)
    // Actually getCoursesForPath selects `courses(*)` ordered by order_index.
    // But my types in code might need adjustment.
    // `getCoursesForPath` returns `Course[]`.

    // Enhance courses with stats
    const coursesWithStats = await Promise.all(
        courses.map(async (course: any) => {
            const stats = await getCourseStats(course.id);
            const meta = course.meta || {};

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

            <CourseList courses={coursesWithStats} pathId={pathId} loading={false} />
        </div>
    );
}


import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PathList } from '@/components/paths/PathList';
import { getPathsForUser, getCourseCountForPath, getFirstLessonForPath } from '@/lib/db/paths';
import { calculatePathProgress } from '@/lib/db/progress';

export default async function PathsPage() {
    const rawPaths = await getPathsForUser();

    // Enhance paths with stats
    const paths = await Promise.all(
        rawPaths.map(async (path) => {
            // Get course count, progress, and first lesson from data layer
            const [courseCount, progress, firstLessonId] = await Promise.all([
                getCourseCountForPath(path.id),
                calculatePathProgress(path.id),
                getFirstLessonForPath(path.id)
            ]);

            return {
                ...path,
                courseCount,
                progress,
                firstLessonId: firstLessonId ?? undefined
            };
        })
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2">Learning Paths</h1>
                    <p className="text-slate-500">Organize your learning journey into structured paths</p>
                </div>
                <Link
                    href="/paths/new"
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                    Create Path
                </Link>
            </div>

            <PathList paths={paths} loading={false} />
        </div>
    );
}

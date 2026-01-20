import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PathList } from '@/components/paths/PathList';
import { getPathsForUser } from '@/lib/db/paths';
import { calculatePathProgress } from '@/lib/db/progress';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function PathsPage() {
    const rawPaths = await getPathsForUser();
    const supabase = await createSupabaseServerClient();

    // Enhance paths with stats
    // We can do this in parallel
    const paths = await Promise.all(
        rawPaths.map(async (path) => {
            // Get course count
            const { data: pathCourses } = await supabase
                .from('path_courses')
                .select('course_id')
                .eq('path_id', path.id);

            const courseCount = pathCourses?.length || 0;
            const progress = await calculatePathProgress(path.id);

            return {
                ...path,
                courseCount,
                progress
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

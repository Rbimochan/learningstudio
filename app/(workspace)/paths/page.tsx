'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PathList } from '@/components/paths/PathList';
import { calculatePathProgress } from '@/lib/utils/progress';

interface PathWithStats {
    id: string;
    title: string;
    description: string | null;
    courseCount: number;
    progress: number;
}

export default function PathsPage() {
    const [paths, setPaths] = useState<PathWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchPaths();
    }, []);

    async function fetchPaths() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        // Fetch learning paths
        const { data: learningPaths } = await supabase
            .from('learning_paths')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!learningPaths) {
            setLoading(false);
            return;
        }

        // For each path, get course count and progress
        const pathsWithStats = await Promise.all(
            learningPaths.map(async (path) => {
                // Get course count
                const { data: pathCourses } = await supabase
                    .from('path_courses')
                    .select('course_id')
                    .eq('path_id', path.id);

                const courseCount = pathCourses?.length || 0;

                // Calculate progress
                const progress = await calculatePathProgress(path.id);

                return {
                    id: path.id,
                    title: path.title,
                    description: path.description,
                    courseCount,
                    progress
                };
            })
        );

        setPaths(pathsWithStats);
        setLoading(false);
    }

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

            <PathList paths={paths} loading={loading} />
        </div>
    );
}

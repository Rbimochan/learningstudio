'use client';

import { PathCard } from './PathCard';
import { PathCardSkeleton } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { FolderOpen } from 'lucide-react';

interface Path {
    id: string;
    title: string;
    description?: string | null;
    courseCount: number;
    progress: number;
    firstLessonId?: string;
}

interface PathListProps {
    paths: Path[];
    loading?: boolean;
}

export function PathList({ paths, loading = false }: PathListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <PathCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (paths.length === 0) {
        return (
            <EmptyState
                icon={FolderOpen}
                title="No learning paths yet"
                description="Create your first learning path to start organizing your courses and track your progress."
                actionLabel="Create Path"
                actionHref="/paths/new"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => (
                <PathCard
                    key={path.id}
                    id={path.id}
                    title={path.title}
                    description={path.description}
                    courseCount={path.courseCount}
                    progress={path.progress}
                    firstLessonId={path.firstLessonId}
                />
            ))}
        </div>
    );
}

'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ProgressRing } from '../ui/ProgressRing';

interface PathCardProps {
    id: string;
    title: string;
    description: string | null;
    courseCount: number;
    progress: number; // 0-100
}

export function PathCard({ id, title, description, courseCount, progress }: PathCardProps) {
    return (
        <Link
            href={`/paths/${id}`}
            className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors truncate">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0">
                    <ProgressRing progress={progress} size="md" />
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{courseCount} {courseCount === 1 ? 'course' : 'courses'}</span>
                </div>
            </div>
        </Link>
    );
}

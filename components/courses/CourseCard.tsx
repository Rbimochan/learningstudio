'use client';

import { PlayCircle, Play } from 'lucide-react';
import Link from 'next/link';
import { ProgressBar } from '../ui/ProgressRing';
import { routes } from '@/lib/routes';

interface CourseCardProps {
    id: string;
    pathId: string;
    title: string;
    description: string | null;
    level?: string;
    tags?: string[];
    lessonCount: number;
    completedCount: number;
    firstLessonId?: string;
}

export function CourseCard({
    id,
    pathId,
    title,
    description,
    level,
    tags = [],
    lessonCount,
    completedCount,
    firstLessonId
}: CourseCardProps) {
    const progress = lessonCount > 0 ? (completedCount / lessonCount) * 100 : 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all group">
            <Link href={routes.workspace.course(pathId, id)} className="block">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-sm">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {level && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {level}
                        </span>
                    )}
                    {tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span className="text-xs text-slate-400">
                            +{tags.length - 3} more
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            <span>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
                        </div>
                        <span>{completedCount} completed</span>
                    </div>
                    <ProgressBar progress={progress} showLabel={false} height="sm" />
                </div>
            </Link>
            
            {firstLessonId && (
                <Link
                    href={routes.workspace.studio(firstLessonId)}
                    className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Play size={18} />
                    Start Course
                </Link>
            )}
        </div>
    );
}

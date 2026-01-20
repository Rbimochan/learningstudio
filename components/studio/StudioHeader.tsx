'use client';

import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '../ui/StatusBadge';

interface StudioHeaderProps {
    lessonTitle: string;
    lessonStatus: 'todo' | 'doing' | 'done';
    backHref: string;
    backLabel?: string;
    onPrevious?: () => void;
    onNext?: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
    onStatusChange?: (status: 'todo' | 'doing' | 'done') => void;
}

export function StudioHeader({
    lessonTitle,
    lessonStatus,
    backHref,
    backLabel = 'Back to Course',
    onPrevious,
    onNext,
    hasPrevious = false,
    hasNext = false,
    onStatusChange
}: StudioHeaderProps) {
    return (
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left: Back button */}
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    {backLabel}
                </Link>

                {/* Center: Lesson navigation */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onPrevious}
                        disabled={!hasPrevious}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-center">
                        <h1 className="text-slate-300 font-medium">{lessonTitle}</h1>
                        <div className="mt-1">
                            <StatusBadge status={lessonStatus} size="sm" />
                        </div>
                    </div>
                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Right: Status buttons */}
                {onStatusChange && (
                    <div className="flex gap-2">
                        {(['todo', 'doing', 'done'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => onStatusChange(status)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${lessonStatus === status
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                {status === 'todo' && 'To Do'}
                                {status === 'doing' && 'Doing'}
                                {status === 'done' && 'Done'}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-4`} />
            <p className="text-slate-500 dark:text-slate-400">{message}</p>
        </div>
    );
}

// Skeleton components for loading states
export function PathCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
            <div className="flex items-center gap-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
            </div>
        </div>
    );
}

export function CourseCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-4"></div>
            <div className="flex items-center gap-2 mb-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
        </div>
    );
}

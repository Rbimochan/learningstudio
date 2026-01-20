import { LessonStatus } from '@/types';

interface StatusBadgeProps {
    status: LessonStatus | 'todo' | 'doing' | 'done';
    size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const styles = {
        todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        doing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        done: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm'
    };

    const labels = {
        todo: 'To Do',
        doing: 'In Progress',
        done: 'Completed'
    };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${styles[status]} ${sizeClasses[size]}`}>
            {labels[status]}
        </span>
    );
}

interface StatusDotProps {
    status: 'todo' | 'doing' | 'done';
}

export function StatusDot({ status }: StatusDotProps) {
    const colors = {
        todo: 'bg-slate-300 dark:bg-slate-600',
        doing: 'bg-blue-500',
        done: 'bg-green-500'
    };

    return (
        <span className={`inline-block w-2 h-2 rounded-full ${colors[status]}`} />
    );
}

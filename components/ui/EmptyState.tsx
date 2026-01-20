import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction
}: EmptyStateProps) {
    return (
        <div className="text-center py-16 px-4">
            {Icon && (
                <div className="flex justify-center mb-4">
                    <Icon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    {description}
                </p>
            )}
            {(actionLabel && (actionHref || onAction)) && (
                <>
                    {actionHref ? (
                        <Link
                            href={actionHref}
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            {actionLabel}
                        </Link>
                    ) : (
                        <button
                            onClick={onAction}
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            {actionLabel}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

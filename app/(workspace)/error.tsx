'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Components';

export default function WorkspaceError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[Workspace Error]', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#050a14]">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-rose-100 dark:bg-rose-950/20 rounded-2xl flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-rose-600 dark:text-rose-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        Something went wrong
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        An unexpected error occurred while loading your workspace.
                    </p>
                </div>
                <div className="space-y-3">
                    <Button onClick={reset} className="w-full">
                        Try Again
                    </Button>
                    <Button
                        onClick={() => (window.location.href = '/paths')}
                        className="w-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"
                    >
                        Return to Learning Paths
                    </Button>
                </div>
                {error.digest && (
                    <p className="mt-6 text-xs text-slate-400 dark:text-slate-600">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}

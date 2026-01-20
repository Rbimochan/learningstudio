'use client';

import { useState } from 'react';

interface LessonFormProps {
    courseId: string;
    initialData?: {
        title: string;
        type: 'youtube' | 'pdf' | 'link';
        source: string;
    };
    onSubmit: (data: {
        title: string;
        type: 'youtube' | 'pdf' | 'link';
        source: string;
    }) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
}

export function LessonForm({
    courseId,
    initialData,
    onSubmit,
    onCancel,
    submitLabel = 'Create Lesson'
}: LessonFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [type, setType] = useState<'youtube' | 'pdf' | 'link'>(initialData?.type || 'youtube');
    const [source, setSource] = useState(initialData?.source || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({ title, type, source });
        } finally {
            setLoading(false);
        }
    };

    const getPlaceholder = () => {
        switch (type) {
            case 'youtube':
                return 'https://www.youtube.com/watch?v=...';
            case 'pdf':
                return 'Upload PDF or enter URL';
            case 'link':
                return 'https://example.com/article';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Lesson Title *
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Introduction to Components"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Lesson Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {(['youtube', 'pdf', 'link'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`px-4 py-3 rounded-lg border-2 font-medium capitalize transition-all ${type === t
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-primary/50'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Source URL *
                </label>
                <input
                    type="url"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                />
                {type === 'youtube' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Paste any YouTube URL format - we'll extract the video ID automatically
                    </p>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? 'Saving...' : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

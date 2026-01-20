'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditPathPage() {
    const router = useRouter();
    const params = useParams();
    const pathId = params.pathId as string;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Update path in database
        console.log('Updating path:', { pathId, title, description });
        router.push(`/paths/${pathId}`);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link
                href={`/paths/${pathId}`}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Path
            </Link>

            <h1 className="text-3xl font-bold dark:text-white mb-8">Edit Learning Path</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Path Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                    <Link
                        href={`/paths/${pathId}`}
                        className="px-8 py-3 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

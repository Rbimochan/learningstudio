import { notFound, redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getPathById, updatePath } from '@/lib/db/paths';
import { routes } from '@/lib/routes';

export default async function EditPathPage({ params }: { params: Promise<{ pathId: string }> }) {
    const { pathId } = await params;
    const path = await getPathById(pathId);

    if (!path) {
        notFound();
    }

    async function handleUpdate(formData: FormData) {
        'use server';
        
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        if (!title?.trim()) {
            return;
        }

        await updatePath(pathId, {
            title: title.trim(),
            description: description?.trim() || undefined
        });

        redirect(routes.workspace.path(pathId));
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Breadcrumbs
                items={[
                    { label: 'Paths', href: '/paths' },
                    { label: path.title, href: `/paths/${pathId}` },
                    { label: 'Edit' }
                ]}
            />

            <h1 className="text-3xl font-bold dark:text-white mb-8">Edit Path</h1>

            <form action={handleUpdate} className="space-y-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Path Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={path.title}
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="e.g., Master Web Development"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={path.description || ''}
                        rows={4}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Describe your learning path..."
                    />
                </div>

                <div className="flex gap-3 justify-end">
                    <a
                        href={routes.workspace.path(pathId)}
                        className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </a>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { createLesson, getLessonsForCourse } from '@/lib/db/lessons';
import { getCourseById } from '@/lib/db/courses';
import { getPathById } from '@/lib/db/paths';

export default async function NewLessonPage({ params }: { params: Promise<{ pathId: string; courseId: string }> }) {
    const { pathId, courseId } = await params;

    const [course, path, lessons] = await Promise.all([
        getCourseById(courseId),
        getPathById(pathId),
        getLessonsForCourse(courseId)
    ]);

    async function handleCreate(formData: FormData) {
        'use server';

        const title = formData.get('title') as string;
        const type = formData.get('type') as string;
        const source = formData.get('source') as string;

        if (!title?.trim() || !source?.trim()) {
            return;
        }

        const currentLessons = await getLessonsForCourse(courseId);
        const nextOrderIndex = currentLessons.length;

        await createLesson({
            title: title.trim(),
            type,
            source: source.trim(),
            course_id: courseId,
            order_index: nextOrderIndex
        });

        redirect(`/paths/${pathId}/courses/${courseId}`);
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Breadcrumbs
                items={[
                    { label: 'Paths', href: '/paths' },
                    { label: path?.title || 'Path', href: `/paths/${pathId}` },
                    { label: course?.title || 'Course', href: `/paths/${pathId}/courses/${courseId}` },
                    { label: 'New Lesson' }
                ]}
            />

            <h1 className="text-3xl font-bold dark:text-white mb-8">Add Lesson</h1>

            <form action={handleCreate} className="space-y-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Lesson Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="e.g., Introduction to React Hooks"
                    />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Type
                    </label>
                    <select
                        id="type"
                        name="type"
                        defaultValue="youtube"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    >
                        <option value="youtube">YouTube Video</option>
                        <option value="pdf">PDF Document</option>
                        <option value="link">Web Link</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="source" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Source URL *
                    </label>
                    <input
                        type="url"
                        id="source"
                        name="source"
                        required
                        placeholder="https://..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                    <a
                        href={`/paths/${pathId}/courses/${courseId}`}
                        className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </a>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        Create Lesson
                    </button>
                </div>
            </form>
        </div>
    );
}

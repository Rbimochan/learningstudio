import { notFound, redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getCourseById, updateCourse } from '@/lib/db/courses';
import { getPathById } from '@/lib/db/paths';
import { routes } from '@/lib/routes';
import { LessonList } from '@/components/lessons/LessonList';
import { getLessonsForCourse } from '@/lib/db/lessons';

export default async function EditCoursePage({ params }: { params: Promise<{ pathId: string; courseId: string }> }) {
    const { pathId, courseId } = await params;

    const [course, path, lessons] = await Promise.all([
        getCourseById(courseId),
        getPathById(pathId),
        getLessonsForCourse(courseId)
    ]);

    if (!course || !path) {
        notFound();
    }

    async function handleUpdate(formData: FormData) {
        'use server';

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        if (!title?.trim()) {
            return;
        }

        await updateCourse(courseId, {
            title: title.trim(),
            description: description?.trim() || undefined
        });

        redirect(routes.workspace.course(pathId, courseId));
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Breadcrumbs
                items={[
                    { label: 'Paths', href: '/paths' },
                    { label: path.title, href: `/paths/${pathId}` },
                    { label: course.title, href: `/paths/${pathId}/courses/${courseId}` },
                    { label: 'Edit' }
                ]}
            />

            <h1 className="text-3xl font-bold dark:text-white mb-8">Edit Course</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <form action={handleUpdate} className="space-y-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Course Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                defaultValue={course.title}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="e.g., Introduction to React"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                defaultValue={course.description || ''}
                                rows={4}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="Describe your course..."
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <a
                                href={routes.workspace.course(pathId, courseId)}
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

                <div>
                    <h2 className="text-xl font-bold dark:text-white mb-4">Lessons ({lessons.length})</h2>
                    {lessons.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                            <p className="text-slate-400 mb-2">No lessons yet</p>
                            <p className="text-sm text-slate-500">Add lessons to start building your course</p>
                        </div>
                    ) : (
                        <LessonList
                            lessons={lessons}
                            onReorder={() => { }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}


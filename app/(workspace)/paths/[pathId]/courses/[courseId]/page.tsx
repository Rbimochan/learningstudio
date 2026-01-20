import { Plus, ArrowLeft, Edit, Play } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LessonList } from '@/components/lessons/LessonList';
import { getCourseById } from '@/lib/db/courses';
import { getLessonsForCourseWithStatus } from '@/lib/db/lessons';
import { getPathById } from '@/lib/db/paths';
import { routes } from '@/lib/routes';

export default async function CourseDetailPage({ params }: { params: Promise<{ pathId: string; courseId: string }> }) {
    const { pathId, courseId } = await params;

    // Fetch course, path, and lessons in parallel
    const [course, path, lessons] = await Promise.all([
        getCourseById(courseId),
        getPathById(pathId),
        getLessonsForCourseWithStatus(courseId)
    ]);

    if (!course || !path) {
        notFound();
    }

    const firstLesson = lessons[0];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Breadcrumbs
                items={[
                    { label: 'Paths', href: '/paths' },
                    { label: path.title, href: `/paths/${pathId}` },
                    { label: course.title }
                ]}
            />

            <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold dark:text-white mb-2">{course.title}</h1>
                    {course.description && (
                        <p className="text-slate-500">{course.description}</p>
                    )}
                </div>
                <div className="flex gap-3 ml-4">
                    {firstLesson && (
                        <Link
                            href={routes.workspace.studio(firstLesson.id)}
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Play size={20} />
                            Start Course
                        </Link>
                    )}
                    <Link
                        href={`/paths/${pathId}/courses/${courseId}/lessons/new`}
                        className="px-6 py-3 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Lesson
                    </Link>
                </div>
            </div>

            {lessons.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-400 mb-4">No lessons in this course yet</p>
                    <Link
                        href={`/paths/${pathId}/courses/${courseId}/lessons/new`}
                        className="text-primary font-semibold hover:underline"
                    >
                        Add your first lesson →
                    </Link>
                </div>

            ) : (
                <div>
                    <h2 className="text-xl font-bold dark:text-white mb-4">
                        Lessons ({lessons.length})
                    </h2>
                    <LessonList
                        lessons={lessons}
                        onReorder={() => { }}
                        onLessonClick={(lessonId) => redirect(routes.workspace.studio(lessonId))}
                    />
                </div>
            )}
        </div>
    );
}

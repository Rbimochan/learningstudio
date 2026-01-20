import { getLessonById, getLessonsForCourseWithStatus } from '@/lib/db/lessons';
import { getLessonContext } from '@/lib/db/context';
import { StudioClientPage } from '@/components/studio/StudioClientPage';
import { notFound } from 'next/navigation';

export default async function StudioPage({ params }: { params: Promise<{ lessonId: string }> }) {
    // Await params in Next.js 15
    const { lessonId } = await params;

    const lesson = await getLessonById(lessonId);

    if (!lesson) {
        notFound();
    }

    const [context, allLessons] = await Promise.all([
        getLessonContext(lessonId),
        getLessonsForCourseWithStatus(lesson.course_id)
    ]);

    return (
        <StudioClientPage
            lesson={lesson}
            allLessons={allLessons}
            context={context}
        />
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { YouTubePlayer } from '@/components/lessons/YouTubePlayer';
import { NotesPanel } from '@/components/notes/NotesPanel';
import { StudioHeader } from '@/components/studio/StudioHeader';
import { extractYouTubeVideoId } from '@/lib/utils/youtube';
import { setLessonStatus } from '@/lib/db/progress';
import { LessonWithStatus } from '@/lib/db/lessons';
import { LessonContext } from '@/lib/db/context';

interface StudioClientPageProps {
    lesson: LessonWithStatus;
    allLessons: LessonWithStatus[];
    context: LessonContext | null;
}

export function StudioClientPage({ lesson: initialLesson, allLessons, context }: StudioClientPageProps) {
    const router = useRouter();
    const [lesson, setLesson] = useState(initialLesson);

    // Update local state if props change (though typically valid for full page reload)
    useEffect(() => {
        setLesson(initialLesson);
    }, [initialLesson]);

    const handleStatusChange = async (newStatus: 'todo' | 'doing' | 'done') => {
        // Optimistic update
        setLesson(prev => ({ ...prev, status: newStatus }));

        const success = await setLessonStatus(lesson.id, newStatus);
        if (!success) {
            // Revert on failure
            setLesson(prev => ({ ...prev, status: lesson.status }));
        } else {
            router.refresh(); // Refresh server data
        }
    };

    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allLessons.length - 1;

    const handlePrevious = () => {
        if (hasPrevious) {
            router.push(`/studio/${allLessons[currentIndex - 1].id}`);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            router.push(`/studio/${allLessons[currentIndex + 1].id}`);
        }
    };

    // Extract video ID for YouTube lessons
    const videoId = lesson.type === 'youtube' ? extractYouTubeVideoId(lesson.source) : null;

    const backHref = context
        ? `/paths/${context.pathId}/courses/${context.courseId}`
        : `/courses/${lesson.course_id}`; // Fallback if no context

    return (
        <div className="h-screen flex flex-col bg-slate-950">
            <StudioHeader
                lessonTitle={lesson.title}
                lessonStatus={lesson.status}
                backHref={backHref}
                backLabel={context?.pathTitle ? `Back to ${context.pathTitle}` : "Back to Course"}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                onStatusChange={handleStatusChange}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
                {/* Video Player */}
                <div className="flex-1 flex items-center justify-center bg-black">
                    {lesson.type === 'youtube' && videoId ? (
                        <YouTubePlayer
                            videoId={videoId}
                            lessonId={lesson.id}
                            initialPosition={0}
                        />
                    ) : (
                        <div className="text-center text-slate-400">
                            <p>Unsupported lesson type: {lesson.type}</p>
                            <p className="text-sm mt-2">Source: {lesson.source}</p>
                        </div>
                    )}
                </div>

                {/* Notes Panel */}
                <div className="w-full md:w-96 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800">
                    <NotesPanel lessonId={lesson.id} />
                </div>
            </div>
        </div>
    );
}

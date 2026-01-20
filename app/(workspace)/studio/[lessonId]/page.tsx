'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { YouTubePlayer } from '@/components/lessons/YouTubePlayer';
import { NotesPanel } from '@/components/notes/NotesPanel';
import { StudioHeader } from '@/components/studio/StudioHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { updateLessonStatus } from '@/lib/utils/progress';
import { extractYouTubeVideoId } from '@/lib/utils/youtube';

interface LessonData {
    id: string;
    title: string;
    type: string;
    source: string;
    course_id: string;
    order_index: number;
    status: 'todo' | 'doing' | 'done';
}

export default function StudioPage() {
    const params = useParams();
    const lessonId = params.lessonId as string;
    const [lesson, setLesson] = useState<LessonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [allLessons, setAllLessons] = useState<LessonData[]>([]);
    const supabase = createClient();

    useEffect(() => {
        fetchLessonData();
    }, [lessonId]);

    async function fetchLessonData() {
        setLoading(true);

        // Fetch lesson data
        const { data: lessonData } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', lessonId)
            .single();

        if (!lessonData) {
            setLoading(false);
            return;
        }

        // Get lesson status
        const { data: { user } } = await supabase.auth.getUser();
        let status: 'todo' | 'doing' | 'done' = 'todo';

        if (user) {
            const { data: progress } = await supabase
                .from('progress')
                .select('status')
                .eq('user_id', user.id)
                .eq('lesson_id', lessonId)
                .single();

            status = progress?.status || 'todo';
        }

        setLesson({ ...lessonData, status });

        // Fetch all lessons in this course for prev/next navigation
        const { data: courseLessons } = await supabase
            .from('lessons')
            .select('id, title, type, source, course_id, order_index')
            .eq('course_id', lessonData.course_id)
            .order('order_index');

        if (courseLessons) {
            // Get status for all lessons
            const lessonsWithStatus = await Promise.all(
                courseLessons.map(async (l) => {
                    if (!user) return { ...l, status: 'todo' as const };

                    const { data: prog } = await supabase
                        .from('progress')
                        .select('status')
                        .eq('user_id', user.id)
                        .eq('lesson_id', l.id)
                        .single();

                    return { ...l, status: prog?.status || 'todo' as const };
                })
            );

            setAllLessons(lessonsWithStatus);
        }

        setLoading(false);
    }

    const handleStatusChange = async (newStatus: 'todo' | 'doing' | 'done') => {
        const success = await updateLessonStatus(lessonId, newStatus);
        if (success && lesson) {
            setLesson({ ...lesson, status: newStatus });
        }
    };

    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allLessons.length - 1;

    const handlePrevious = () => {
        if (hasPrevious) {
            window.location.href = `/studio/${allLessons[currentIndex - 1].id}`;
        }
    };

    const handleNext = () => {
        if (hasNext) {
            window.location.href = `/studio/${allLessons[currentIndex + 1].id}`;
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-950">
                <LoadingState message="Loading lesson..." />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-950">
                <p className="text-slate-400">Lesson not found</p>
            </div>
        );
    }

    // Extract video ID for YouTube lessons
    const videoId = lesson.type === 'youtube' ? extractYouTubeVideoId(lesson.source) : null;

    return (
        <div className="h-screen flex flex-col bg-slate-950">
            <StudioHeader
                lessonTitle={lesson.title}
                lessonStatus={lesson.status}
                backHref={`/paths/temp/courses/${lesson.course_id}`}
                backLabel="Back to Course"
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
                            lessonId={lessonId}
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
                    <NotesPanel lessonId={lessonId} />
                </div>
            </div>
        </div>
    );
}

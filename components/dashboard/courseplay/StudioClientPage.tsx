'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { YouTubePlayer } from '@/components/lessons/YouTubePlayer';
import { NotesPanel } from '@/components/notes/NotesPanel';
import { extractYouTubeVideoId } from '@/lib/utils/youtube';
import { setLessonStatus } from '@/lib/db/progress';
import { upsertCourseProgress } from '@/lib/db/course-progress';
import { LessonWithStatus } from '@/lib/db/lessons';
import { LessonContext } from '@/lib/db/context';
import {
    Search,
    Home,
    BookOpen,
    ChevronDown,
    CircleCheck,
    Lightbulb,
    FileText,
    Languages,
    Sparkles,
    X,
    Send,
    ChevronUp,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface StudioClientPageProps {
    lesson: LessonWithStatus;
    allLessons: LessonWithStatus[];
    context: LessonContext | null;
}

export function StudioClientPage({ lesson: initialLesson, allLessons, context }: StudioClientPageProps) {
    const router = useRouter();
    const [lesson, setLesson] = useState(initialLesson);
    const [isAiOpen, setIsAiOpen] = useState(true);

    // Update local state if props change
    useEffect(() => {
        setLesson(initialLesson);

        // Track course progress whenever lesson changes
        if (initialLesson.course_id) {
            upsertCourseProgress(initialLesson.course_id, initialLesson.id);
        }
    }, [initialLesson]);

    // Calculate current lesson index and navigation
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allLessons.length - 1;
    const previousLesson = hasPrevious ? allLessons[currentIndex - 1] : null;
    const nextLesson = hasNext ? allLessons[currentIndex + 1] : null;

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

    const handlePrevious = () => {
        if (previousLesson) {
            router.push(`/studio/${previousLesson.id}`);
        }
    };

    const handleNext = () => {
        if (nextLesson) {
            router.push(`/studio/${nextLesson.id}`);
        }
    };

    // Extract video ID for YouTube lessons
    const videoId = lesson.type === 'youtube' ? extractYouTubeVideoId(lesson.source) : null;

    const backHref = context
        ? `/paths/${context.pathId}/courses/${context.courseId}`
        : `/paths`; // Fallback

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#101822] text-[#0d131b] dark:text-slate-200">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151f2b] h-full shrink-0">
                <div className="p-4 flex flex-col h-full">
                    {/* Workspace Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <Link href={backHref} className="bg-primary/10 rounded-lg p-2 hover:bg-primary/20 transition-colors">
                            <ChevronLeft className="text-primary" size={20} />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-[#0d131b] dark:text-white text-sm font-bold leading-tight">YouLearn Studio</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">Personal Workspace</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-hide">
                        <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                            <Search size={18} />
                            <p className="text-sm font-medium">Search</p>
                        </div>
                        <Link href="/paths" className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                            <Home size={18} />
                            <p className="text-sm font-medium">Home</p>
                        </Link>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                            <BookOpen size={18} />
                            <p className="text-sm font-medium font-semibold">My Library</p>
                        </div>

                        <div className="mt-6 mb-2">
                            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Course</p>
                        </div>

                        <div className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                            <ChevronDown size={14} />
                            <p className="text-sm font-medium truncate">{context?.courseTitle || 'Course'}</p>
                        </div>

                        <div className="ml-4 flex flex-col border-l border-slate-200 dark:border-slate-800">
                            {allLessons.map((l) => (
                                <Link
                                    key={l.id}
                                    href={`/studio/${l.id}`}
                                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-xs transition-colors ${l.id === lesson.id
                                        ? 'text-primary border-l-2 border-primary bg-primary/5 font-semibold'
                                        : 'text-slate-500 hover:text-primary'
                                        }`}
                                >
                                    <span>{l.title}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button className="w-full h-9 px-4 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                            Upgrade Plan
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto scrollbar-hide bg-white dark:bg-[#101822]">
                {/* Top Navbar */}
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#101822]/80 backdrop-blur-md px-8 py-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm font-medium">Courses</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400 text-sm font-medium truncate max-w-[150px]">{context?.courseTitle}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-[#0d131b] dark:text-white text-sm font-semibold truncate max-w-[200px]">{lesson.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Lesson Navigation */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevious}
                                disabled={!hasPrevious}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={14} />
                                Prev
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!hasNext}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <p className="text-slate-500 dark:text-slate-300 text-[10px] font-bold">PROGRESS</p>
                                    <p className="text-accent-purple text-[10px] font-bold">65%</p>
                                </div>
                                <div className="w-32 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div className="h-full bg-accent-purple rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleStatusChange(lesson.status === 'done' ? 'todo' : 'done')}
                            className={`flex items-center justify-center rounded-lg h-9 px-4 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${lesson.status === 'done'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                                }`}
                        >
                            {lesson.status === 'done' ? (
                                <span className="flex items-center gap-2"><CircleCheck size={14} /> Completed</span>
                            ) : (
                                'Mark as Complete'
                            )}
                        </button>
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                            U
                        </div>
                    </div>
                </header>

                {/* Video Canvas */}
                <div className="max-w-4xl mx-auto w-full px-8 py-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[#0d131b] dark:text-white mb-2">{lesson.title}</h2>
                        <p className="text-slate-500 text-sm">In this lesson, we explore the fundamentals of {lesson.title.toLowerCase()}.</p>
                    </div>

                    {/* Video Player Component */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-2xl shadow-primary/5">
                        {lesson.type === 'youtube' && videoId ? (
                            <YouTubePlayer
                                videoId={videoId}
                                lessonId={lesson.id}
                                initialPosition={0}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <p>Unsupported lesson type: {lesson.type}</p>
                            </div>
                        )}
                    </div>

                    {/* Content Tabs/Sections */}
                    <div className="mt-12 space-y-12">
                        {/* Takeaways */}
                        <section>
                            <h3 className="text-lg font-bold text-[#0d131b] dark:text-white mb-4 flex items-center gap-2">
                                <Lightbulb className="text-primary" size={20} />
                                Key Takeaways
                            </h3>
                            <div className="space-y-3">
                                <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="flex items-center justify-between cursor-pointer">
                                        <p className="font-semibold text-sm">Core Concepts</p>
                                        <ChevronUp className="text-slate-400" size={18} />
                                    </div>
                                    <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Understanding the fundamental mechanics is crucial. This lesson covers the primary building blocks and how they interact within the larger system.
                                    </div>
                                </div>
                                <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm">Advanced Applications</p>
                                        <ChevronDown className="text-slate-400" size={18} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Interactive Transcript */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-[#0d131b] dark:text-white flex items-center gap-2">
                                    <FileText className="text-primary" size={20} />
                                    Transcript
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Languages size={14} />
                                    <span>English (Auto-generated)</span>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-4 scrollbar-hide">
                                <div className="flex gap-4 group cursor-pointer">
                                    <span className="text-primary text-xs font-bold whitespace-nowrap pt-1">00:12</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                        Today we're going to dive deep into the concepts of this module. Many people find this challenging at first, but we'll break it down step-by-step.
                                    </p>
                                </div>
                                <div className="flex gap-4 group bg-primary/5 -mx-4 px-4 py-2 rounded-lg border-l-2 border-primary">
                                    <span className="text-primary text-xs font-bold whitespace-nowrap pt-1">02:14</span>
                                    <p className="text-sm text-[#0d131b] dark:text-white leading-relaxed font-medium">
                                        Notice how this specific component handles its internal state. This is where most of the logic resides, ensuring a smooth user experience.
                                    </p>
                                </div>
                                <div className="flex gap-4 group cursor-pointer">
                                    <span className="text-primary text-xs font-bold whitespace-nowrap pt-1">03:45</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                        Finally, let's look at how we can optimize this for production. It's not just about getting it to work; it's about making it performant.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* AI Assist Sidebar (Right) */}
            {isAiOpen ? (
                <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151f2b] flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-accent-purple" size={18} />
                            <h3 className="text-sm font-bold">AI Assist</h3>
                        </div>
                        <X
                            className="text-slate-400 size-4 cursor-pointer hover:text-slate-600"
                            onClick={() => setIsAiOpen(false)}
                        />
                    </div>

                    {/* Notes/AI Content */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <NotesPanel lessonId={lesson.id} />
                    </div>

                    {/* AI Chat Input - Simplified for UI */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-black/10">
                        <div className="relative">
                            <textarea
                                className="w-full bg-white dark:bg-[#101822] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none scrollbar-hide"
                                placeholder="Ask AI about this lesson..."
                                rows={2}
                            ></textarea>
                            <button className="absolute bottom-3 right-3 size-8 bg-primary text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </aside>
            ) : (
                <div
                    className="w-12 border-l border-slate-200 dark:border-slate-800 flex flex-col items-center pt-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => setIsAiOpen(true)}
                >
                    <Sparkles className="text-accent-purple" size={18} />
                </div>
            )}
        </div>
    );
}

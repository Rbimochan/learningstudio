
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from './supabase/client';
import { Course, Lesson, User, AppState, LessonStatus, LessonType, CourseLevel } from '../types';
import { useRouter } from 'next/navigation';


interface StoreContextValue {
    state: AppState;
    login: (email: string) => void; // meaningful for mock, less so for real auth but keeping signature
    logout: () => void;
    addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'lessonCount' | 'completedCount'>) => Promise<void>;
    updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;
    addLesson: (lesson: Omit<Lesson, 'id' | 'status' | 'orderIndex'>) => Promise<void>;
    updateLesson: (id: string, updates: Partial<Lesson>) => Promise<void>;
    deleteLesson: (id: string) => Promise<void>;
    reorderLessons: (lessons: Lesson[]) => Promise<void>;
    toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const supabase = createClient();
    const router = useRouter();
    const [state, setState] = useState<AppState>({
        user: null,
        learningPaths: [],
        courses: [],
        lessons: [],
        currentPath: null,
        isLoading: true,
        theme: 'light'
    });

    // Hydrate Theme
    useEffect(() => {
        const savedTheme = (localStorage.getItem('study_theme') as 'light' | 'dark') || 'light';
        setState(prev => ({ ...prev, theme: savedTheme }));
        if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    }, []);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setState(prev => ({ ...prev, user: null, isLoading: false }));
                return;
            }

            const currentUser: User = {
                id: user.id,
                email: user.email!,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            };

            // Fetch Courses
            const { data: coursesData } = await supabase
                .from('courses')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            // Fetch Lessons (for all courses - optimization possible later)
            // We need to fetch lessons where course_id is in our courses list
            const courseIds = coursesData?.map(c => c.id) || [];
            let lessonsData: any[] = [];
            let progressData: any[] = [];
            let notesData: any[] = [];

            if (courseIds.length > 0) {
                const { data: lData } = await supabase
                    .from('lessons')
                    .select('*')
                    .in('course_id', courseIds)
                    .order('order_index', { ascending: true });
                lessonsData = lData || [];

                const { data: pData } = await supabase
                    .from('progress')
                    .select('*')
                    .eq('user_id', user.id)
                    .in('lesson_id', lessonsData.map(l => l.id));
                progressData = pData || [];

                const { data: nData } = await supabase
                    .from('notes')
                    .select('*')
                    .eq('user_id', user.id)
                    .in('lesson_id', lessonsData.map(l => l.id));
                notesData = nData || [];
            }

            // Map to AppState Types
            const mappedLessons: Lesson[] = lessonsData.map(l => {
                const prog = progressData.find(p => p.lesson_id === l.id);
                const note = notesData.find(n => n.lesson_id === l.id);
                return {
                    id: l.id,
                    courseId: l.course_id,
                    title: l.title,
                    type: l.type as LessonType,
                    status: (prog?.status as LessonStatus) || LessonStatus.TODO,
                    sourceUrl: l.source,
                    orderIndex: l.order_index,
                    notes: note?.content || '',
                    duration: (l.meta as any)?.duration,
                    thumbnail: (l.meta as any)?.thumbnail,
                    lastPosition: prog?.last_position || 0
                };
            });

            const mappedCourses: Course[] = (coursesData || []).map(c => {
                const courseLessons = mappedLessons.filter(l => l.courseId === c.id);
                const completed = courseLessons.filter(l => l.status === LessonStatus.DONE).length;
                return {
                    id: c.id,
                    pathId: '', // TODO: Will be populated when path_courses junction table is used
                    title: c.title,
                    description: c.description || '',
                    level: (c.meta as any)?.level || CourseLevel.BEGINNER,
                    tags: (c.meta as any)?.tags || [],
                    lessonCount: courseLessons.length,
                    completedCount: completed,
                    orderIndex: 0, // TODO: Will be populated when path_courses junction table is used
                    createdAt: c.created_at,
                    thumbnail: (c.meta as any)?.thumbnail || `https://picsum.photos/seed/${c.id}/600/400`
                };
            });

            setState(prev => ({
                ...prev,
                user: currentUser,
                courses: mappedCourses,
                lessons: mappedLessons,
                isLoading: false
            }));
        };

        fetchData();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                fetchData();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string) => {
        // This is primarily used by the Login Page which we'll update to hit Supabase directly.
        // But if we wanted to support it here:
        // await supabase.auth.signInWithOtp({ email });
        // For now, we rely on the component to handle the async login call.
        console.log("Login triggered in store (handled by component logic)");
    };

    const logout = async () => {
        // Sign out from Supabase
        await supabase.auth.signOut();

        setState(prev => ({ ...prev, user: null, courses: [], lessons: [] }));
        router.replace('/login');
    };

    const toggleTheme = () => {
        setState(prev => {
            const newTheme = prev.theme === 'light' ? 'dark' : 'light';
            if (newTheme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
            localStorage.setItem('study_theme', newTheme);
            return { ...prev, theme: newTheme };
        });
    };

    const addCourse = async (courseData: any) => {
        if (!state.user) return;

        const { data, error } = await supabase.from('courses').insert({
            user_id: state.user.id,
            title: courseData.title,
            description: courseData.description,
            meta: {
                level: courseData.level,
                tags: courseData.tags,
                thumbnail: courseData.thumbnail
            }
        }).select().single();

        if (error || !data) {
            console.error(error);
            return;
        }

        const newCourse: Course = {
            id: data.id,
            pathId: '', // TODO: Will be populated when path_courses junction table is used
            title: data.title,
            description: data.description || '',
            level: (data.meta as any)?.level || CourseLevel.BEGINNER,
            tags: (data.meta as any)?.tags || [],
            lessonCount: 0,
            completedCount: 0,
            orderIndex: 0, // TODO: Will be populated when path_courses junction table is used
            createdAt: data.created_at,
            thumbnail: (data.meta as any)?.thumbnail || `https://picsum.photos/seed/${data.id}/600/400`
        };

        setState(prev => ({ ...prev, courses: [newCourse, ...prev.courses] }));
    };

    const updateCourse = async (id: string, updates: Partial<Course>) => {
        const { error } = await supabase.from('courses').update({
            title: updates.title,
            description: updates.description,
            // deep merge meta if needed, strictly simpler here
        }).eq('id', id);

        if (!error) {
            setState(prev => ({
                ...prev,
                courses: prev.courses.map(c => c.id === id ? { ...c, ...updates } : c)
            }));
        }
    };

    const deleteCourse = async (id: string) => {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (!error) {
            setState(prev => ({
                ...prev,
                courses: prev.courses.filter(c => c.id !== id),
                lessons: prev.lessons.filter(l => l.courseId !== id)
            }));
        }
    };

    const addLesson = async (lessonData: any) => {
        const newOrder = state.lessons.filter(l => l.courseId === lessonData.courseId).length;

        const { data, error } = await supabase.from('lessons').insert({
            course_id: lessonData.courseId,
            title: lessonData.title,
            type: lessonData.type,
            source: lessonData.sourceUrl,
            order_index: newOrder,
            meta: { duration: lessonData.duration }
        }).select().single();

        if (error || !data) return;

        const newLesson: Lesson = {
            id: data.id,
            courseId: data.course_id,
            title: data.title,
            type: data.type as LessonType,
            status: LessonStatus.TODO,
            sourceUrl: data.source,
            orderIndex: data.order_index,
            duration: (data.meta as any)?.duration
        };

        setState(prev => {
            const updatedLessons = [...prev.lessons, newLesson];
            // Recalculate counts
            const courseLessons = updatedLessons.filter(l => l.courseId === lessonData.courseId);
            const completed = courseLessons.filter(l => l.status === LessonStatus.DONE).length;

            return {
                ...prev,
                lessons: updatedLessons,
                courses: prev.courses.map(c => c.id === lessonData.courseId ? {
                    ...c, lessonCount: courseLessons.length, completedCount: completed
                } : c)
            };
        });
    };

    const updateLesson = async (id: string, updates: Partial<Lesson>) => {
        if (updates.status) {
            // Update Progress
            await supabase.from('progress').upsert({
                lesson_id: id,
                user_id: state.user!.id,
                status: updates.status,
                updated_at: new Date().toISOString()
            } as any);
        }
        if (updates.notes !== undefined) {
            // Update Notes
            await supabase.from('notes').upsert({
                lesson_id: id,
                user_id: state.user!.id,
                content: updates.notes,
                updated_at: new Date().toISOString()
            } as any);
        }

        setState(prev => {
            const newLessons = prev.lessons.map(l => l.id === id ? { ...l, ...updates } : l);
            const lesson = prev.lessons.find(l => l.id === id);
            if (!lesson) return prev;

            const courseLessons = newLessons.filter(l => l.courseId === lesson.courseId);
            const completed = courseLessons.filter(l => l.status === LessonStatus.DONE).length;

            return {
                ...prev,
                lessons: newLessons,
                courses: prev.courses.map(c => c.id === lesson.courseId ? {
                    ...c, completedCount: completed
                } : c)
            };
        });
    };

    const reorderLessons = async (reorderedLessons: Lesson[]) => {
        // Optimistic Update
        setState(prev => {
            const orderMap = new Map(reorderedLessons.map(l => [l.id, l.orderIndex]));

            const newLessons = prev.lessons.map(l => {
                const newIndex = orderMap.get(l.id);
                if (newIndex !== undefined) {
                    return { ...l, orderIndex: newIndex };
                }
                return l;
            });

            // Re-sort to maintain internal consistency if needed by other components relying on array order
            // But usually we sort on render. Let's just update the indices.

            return {
                ...prev,
                lessons: newLessons
            };
        });

        // Backend Update
        const updates = reorderedLessons.map(l => ({
            id: l.id,
            course_id: l.courseId,
            title: l.title,
            type: l.type,
            source: l.sourceUrl,
            order_index: l.orderIndex,
            // we have to be careful with other required fields if upsert validates strictly.
            // safely we should fetch them or include them.
            // For now, assuming these fields are enough or using just update if possible.
            // But upsert is easiest for batch.
        }));

        const { error } = await supabase
            .from('lessons')
            .upsert(updates as any)
            .select();

        if (error) {
            console.error('Error reordering lessons:', error);
            // Revert optimistic update if needed? For MVP usually let it slide/fetch on refresh.
        }
    };

    const deleteLesson = async (id: string) => {
        await supabase.from('lessons').delete().eq('id', id);

        setState(prev => {
            const lesson = prev.lessons.find(l => l.id === id);
            if (!lesson) return prev; // Should not happen

            const newLessons = prev.lessons.filter(l => l.id !== id);
            const courseLessons = newLessons.filter(l => l.courseId === lesson.courseId);
            const completed = courseLessons.filter(l => l.status === LessonStatus.DONE).length;

            return {
                ...prev,
                lessons: newLessons,
                courses: prev.courses.map(c => c.id === lesson.courseId ? {
                    ...c, lessonCount: courseLessons.length, completedCount: completed
                } : c)
            };
        });
    };

    return (
        <StoreContext.Provider value={{
            state, login, logout, addCourse, updateCourse, deleteCourse,
            addLesson, updateLesson, deleteLesson, reorderLessons, toggleTheme
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within a StoreProvider");
    return context;
};

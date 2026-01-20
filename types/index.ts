
export enum LessonType {
    YOUTUBE = 'youtube',
    PDF = 'pdf',
    LINK = 'link'
}

export enum LessonStatus {
    TODO = 'todo',
    DOING = 'doing',
    DONE = 'done'
}

export enum CourseLevel {
    BEGINNER = 'Beginner',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced'
}

export interface LearningPath {
    id: string;
    userId: string;
    title: string;
    description: string;
    courseCount: number;
    completedCourses: number;
    createdAt: string;
    updatedAt: string;
}

export interface Course {
    id: string;
    pathId: string;
    title: string;
    description: string;
    level: CourseLevel;
    tags: string[];
    lessonCount: number;
    completedCount: number;
    orderIndex: number;
    createdAt: string;
    thumbnail?: string;
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    type: LessonType;
    status: LessonStatus;
    sourceUrl: string;
    orderIndex: number;
    duration?: string;
    thumbnail?: string;
    notes?: string;
    lastPosition?: number;
}

export interface LessonProgress {
    id: string;
    userId: string;
    lessonId: string;
    status: LessonStatus;
    lastPosition: number;
    completedAt?: string;
    lastOpenedAt: string;
}

export interface Note {
    id: string;
    userId: string;
    lessonId: string;
    content: string;
    timestamp?: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
}

export interface AppState {
    user: User | null;
    learningPaths: LearningPath[];
    courses: Course[];
    lessons: Lesson[];
    currentPath: LearningPath | null;
    isLoading: boolean;
    theme: 'light' | 'dark';
}

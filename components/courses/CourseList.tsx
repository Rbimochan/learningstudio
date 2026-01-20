'use client';

import { CourseCard } from './CourseCard';
import { CourseCardSkeleton } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { GraduationCap } from 'lucide-react';

interface Course {
    id: string;
    pathId: string;
    title: string;
    description: string | null;
    level?: string;
    tags?: string[];
    lessonCount: number;
    completedCount: number;
    firstLessonId?: string;
}

interface CourseListProps {
    courses: Course[];
    pathId: string;
    loading?: boolean;
}

export function CourseList({ courses, pathId, loading = false }: CourseListProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <CourseCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <EmptyState
                icon={GraduationCap}
                title="No courses in this path yet"
                description="Add your first course to start building your learning journey."
                actionLabel="Add Course"
                actionHref={`/paths/${pathId}/courses/new`}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    {...course}
                />
            ))}
        </div>
    );
}

'use client';

import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CourseDetailPage() {
    const params = useParams();
    const pathId = params.pathId as string;
    const courseId = params.courseId as string;

    return (
        <div className="p-8">
            <Link
                href={`/paths/${pathId}`}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6"
            >
                <ArrowLeft size={20} />
                Back to Path
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2">Course Title</h1>
                    <p className="text-slate-500">Course description goes here</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href={`/paths/${pathId}/courses/${courseId}/edit`}
                        className="px-6 py-3 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Edit Course
                    </Link>
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <Plus size={20} />
                        Add Lesson
                    </button>
                </div>
            </div>

            <div className="text-center py-16">
                <p className="text-slate-400 mb-4">No lessons in this course yet</p>
                <button className="text-primary font-semibold hover:underline">
                    Add your first lesson →
                </button>
            </div>
        </div>
    );
}

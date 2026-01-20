'use client'

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Video, FileText, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { StatusDot } from '../ui/StatusBadge'
import type { Database } from '@/types/database.types'

type Lesson = Database['public']['Tables']['lessons']['Row'] & {
    status?: 'todo' | 'doing' | 'done';
}

function SortableLesson({ lesson, onClick }: { lesson: Lesson; onClick?: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: lesson.id
    })

    // Basic style for the transforming element
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: transform ? 999 : 'auto', // Ensure dragged item is on top
        position: 'relative' as const,
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'youtube': return <Video className="w-5 h-5 text-red-500" />
            case 'pdf': return <FileText className="w-5 h-5 text-orange-500" />
            case 'link': return <LinkIcon className="w-5 h-5 text-blue-500" />
            default: return <FileText className="w-5 h-5 text-gray-500" />
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow group select-none"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-shrink-0">
                {getIcon(lesson.type)}
            </div>

            <div className="flex-grow min-w-0 cursor-pointer" onClick={onClick}>
                <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                    {lesson.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">{lesson.source}</p>
            </div>

            {lesson.status && (
                <div className="flex-shrink-0">
                    <StatusDot status={lesson.status} />
                </div>
            )}

            <div className="text-xs text-gray-400 font-mono flex-shrink-0">
                #{lesson.order_index + 1}
            </div>

            {onClick && (
                <button
                    onClick={onClick}
                    className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Open in Studio"
                >
                    <ExternalLink className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}

export function LessonList({
    lessons,
    onReorder,
    onLessonClick
}: {
    lessons: Lesson[]
    onReorder: (lessons: Lesson[]) => void
    onLessonClick?: (lessonId: string) => void
}) {
    const router = useRouter()

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = lessons.findIndex(l => l.id === active.id)
        const newIndex = lessons.findIndex(l => l.id === over.id)

        const reordered = [...lessons]
        const [moved] = reordered.splice(oldIndex, 1)
        reordered.splice(newIndex, 0, moved)

        // Update order_index for all affected lessons
        const updated = reordered.map((lesson, idx) => ({
            ...lesson,
            order_index: idx
        }))

        onReorder(updated)
    }

    const handleLessonClick = (lessonId: string) => {
        if (onLessonClick) {
            onLessonClick(lessonId)
        } else {
            router.push(`/studio/${lessonId}`)
        }
    }

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {lessons.map(lesson => (
                        <SortableLesson
                            key={lesson.id}
                            lesson={lesson}
                            onClick={() => handleLessonClick(lesson.id)}
                        />
                    ))}
                    {lessons.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-slate-800/50">
                            <p className="text-gray-500 dark:text-gray-400">No lessons yet. Add your first lesson above!</p>
                        </div>
                    )}
                </div>
            </SortableContext>
        </DndContext>
    )
}

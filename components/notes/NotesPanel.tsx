'use client'

import { useState, useEffect, useCallback } from 'react'
import { getNotesForLesson, upsertNoteForLesson } from '@/lib/db/notes'
import { Save, Loader2 } from 'lucide-react'

export function NotesPanel({ lessonId }: { lessonId: string }) {
    const [content, setContent] = useState('')
    const [noteId, setNoteId] = useState<string | null>(null)
    const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved'>('loading')

    const fetchNote = useCallback(async () => {
        setStatus('loading')
        try {
            const data = await getNotesForLesson(lessonId)
            if (data) {
                setContent(data.content)
                setNoteId(data.id)
            } else {
                setContent('')
                setNoteId(null)
            }
        } catch (error) {
            console.error('Failed to fetch note:', error)
        }
        setStatus('idle')
    }, [lessonId])

    useEffect(() => {
        fetchNote()
    }, [fetchNote])

    const saveNote = async () => {
        if (!content.trim()) return

        setStatus('saving')
        try {
            const data = await upsertNoteForLesson(lessonId, content, noteId)
            if (data) setNoteId(data.id)
            setStatus('saved')
            setTimeout(() => setStatus('idle'), 2000)
        } catch (error) {
            console.error('Failed to save note:', error)
            setStatus('idle')
        }
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#151f2b]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-black/20">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Notes</h3>

                <button
                    onClick={saveNote}
                    disabled={status === 'saving' || status === 'loading'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${status === 'saved'
                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                            : 'text-white bg-primary hover:opacity-90 disabled:opacity-50'
                        }`}
                >
                    {status === 'saving' ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span className="hidden sm:inline">Saving...</span>
                        </>
                    ) : status === 'saved' ? (
                        <>
                            <Save className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Saved</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Save</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex-1 p-4 relative">
                {status === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#151f2b]/50 z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
                    </div>
                )}
                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value)
                        if (status === 'saved') setStatus('idle')
                    }}
                    className="w-full h-full resize-none outline-none bg-transparent text-slate-700 dark:text-slate-300 leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    placeholder="Capture your thoughts here..."
                />
            </div>
        </div>
    )
}

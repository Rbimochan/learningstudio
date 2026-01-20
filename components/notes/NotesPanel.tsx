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

    // Auto-save logic (optional, but good UX)
    // useEffect(() => {
    //   const timeout = setTimeout(() => {
    //     if (content) saveNote()
    //   }, 3000)
    //   return () => clearTimeout(timeout)
    // }, [content])

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-800">My Notes</h3>

                <button
                    onClick={saveNote}
                    disabled={status === 'saving' || status === 'loading'}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${status === 'saved'
                        ? 'text-green-600 bg-green-50'
                        : 'text-white bg-black hover:bg-gray-800 disabled:opacity-50'
                        }`}
                >
                    {status === 'saving' ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Saving...
                        </>
                    ) : status === 'saved' ? (
                        <>
                            <Save className="w-3.5 h-3.5" />
                            Saved
                        </>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5" />
                            Save Note
                        </>
                    )}
                </button>
            </div>

            <div className="flex-1 p-4 relative">
                {status === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                )}
                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value)
                        if (status === 'saved') setStatus('idle')
                    }}
                    className="w-full h-full resize-none outline-none text-gray-700 leading-relaxed placeholder:text-gray-300"
                    placeholder="Type your notes here... They will be saved to your account."
                />
            </div>
        </div>
    )
}

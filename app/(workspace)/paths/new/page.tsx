'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPath } from '@/lib/db/paths';
import { createCourseAndLinkToPath } from '@/lib/db/courses';
import { createLesson } from '@/lib/db/lessons';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
    GripVertical,
    PlayCircle,
    Link as LinkIcon,
    FileUp,
    Plus,
    PlusCircle,
    Trash2,
    X,
    Youtube
} from 'lucide-react';

type ContentType = 'youtube' | 'link' | 'file';

interface ContentItem {
    id: string;
    type: ContentType;
    title: string;
    source: string;
}

interface Module {
    id: string;
    title: string;
    content: ContentItem[];
}

export default function NewPathPage() {
    const router = useRouter();
    const [title, setTitle] = useState('Learning Full Stack');
    const [loading, setLoading] = useState(false);
    const [activeAddMenu, setActiveAddMenu] = useState<string | null>(null);
    const [selectedContent, setSelectedContent] = useState<Set<string>>(new Set());
    const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const confirmDialog = useConfirmDialog();

    // Initial state with one module
    const [modules, setModules] = useState<Module[]>([
        {
            id: '1',
            title: 'Introduction',
            content: [
                { id: 'c1', type: 'youtube', title: 'Course Intro', source: 'https://youtube.com/...' }
            ]
        }
    ]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveAddMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAddModule = () => {
        const newModule: Module = {
            id: crypto.randomUUID(),
            title: 'New Module',
            content: []
        };
        setModules([...modules, newModule]);
    };

    const handleDeleteModule = (moduleId: string) => {
        // Check if any content in this module is selected
        const moduleContent = modules.find(m => m.id === moduleId)?.content || [];
        const hasSelectedContent = moduleContent.some(c => selectedContent.has(c.id));

        if (hasSelectedContent) {
            // Delete only selected content
            handleDeleteSelectedContent(moduleId);
        } else {
            // Show confirmation dialog for deleting the entire module
            setModuleToDelete(moduleId);
            confirmDialog.open();
        }
    };

    const confirmDeleteModule = () => {
        if (moduleToDelete) {
            setModules(modules.filter(m => m.id !== moduleToDelete));
            setModuleToDelete(null);
            // Clear any selections from deleted module
            const deletedModule = modules.find(m => m.id === moduleToDelete);
            if (deletedModule) {
                const newSelected = new Set(selectedContent);
                deletedModule.content.forEach(c => newSelected.delete(c.id));
                setSelectedContent(newSelected);
            }
        }
    };

    const handleDeleteSelectedContent = (moduleId: string) => {
        setModules(modules.map(m => {
            if (m.id === moduleId) {
                const remainingContent = m.content.filter(c => !selectedContent.has(c.id));
                // Clear selections for deleted content
                const newSelected = new Set(selectedContent);
                m.content.forEach(c => {
                    if (selectedContent.has(c.id)) {
                        newSelected.delete(c.id);
                    }
                });
                setSelectedContent(newSelected);
                return { ...m, content: remainingContent };
            }
            return m;
        }));
    };

    const toggleContentSelection = (contentId: string) => {
        const newSelected = new Set(selectedContent);
        if (newSelected.has(contentId)) {
            newSelected.delete(contentId);
        } else {
            newSelected.add(contentId);
        }
        setSelectedContent(newSelected);
    };

    const handleUpdateModuleTitle = (moduleId: string, newTitle: string) => {
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, title: newTitle } : m
        ));
    };

    const handleAddContent = (moduleId: string, type: ContentType) => {
        const newContent: ContentItem = {
            id: crypto.randomUUID(),
            type,
            title: type === 'youtube' ? 'New Video' : type === 'link' ? 'New Link' : 'New File',
            source: ''
        };
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, content: [...m.content, newContent] } : m
        ));
        setActiveAddMenu(null);
    };


    const handleUpdateContent = (moduleId: string, contentId: string, updates: Partial<ContentItem>) => {
        setModules(modules.map(m =>
            m.id === moduleId ? {
                ...m,
                content: m.content.map(c =>
                    c.id === contentId ? { ...c, ...updates } : c
                )
            } : m
        ));
    };

    const handleDeleteContent = (moduleId: string, contentId: string) => {
        setModules(modules.map(m =>
            m.id === moduleId ? {
                ...m,
                content: m.content.filter(c => c.id !== contentId)
            } : m
        ));
        // Remove from selection if it was selected
        const newSelected = new Set(selectedContent);
        newSelected.delete(contentId);
        setSelectedContent(newSelected);
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setLoading(true);

        try {
            // 1. Create the Path
            const path = await createPath({
                title: title.trim(),
                description: undefined
            });

            if (!path) {
                throw new Error('Failed to create path');
            }

            // 2. Create Courses (Modules) for the Path
            for (const module of modules) {
                const course = await createCourseAndLinkToPath(path.id, {
                    title: module.title,
                });

                if (course) {
                    // 3. Create Lessons for the Course
                    for (let i = 0; i < module.content.length; i++) {
                        const item = module.content[i];
                        await createLesson({
                            title: item.title,
                            type: item.type,
                            source: item.source || '#',
                            course_id: course.id,
                            order_index: i
                        });
                    }
                }
            }

            router.push(`/paths/${path.id}`);
        } catch (error) {
            console.error('Error creating path:', error);
            alert('Failed to create path. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getContentIcon = (type: ContentType) => {
        switch (type) {
            case 'youtube': return <Youtube className="text-red-500" size={18} />;
            case 'link': return <LinkIcon className="text-blue-500" size={18} />;
            case 'file': return <FileUp className="text-orange-500" size={18} />;
        }
    };

    const getContentLabel = (type: ContentType) => {
        switch (type) {
            case 'youtube': return 'YouTube Video';
            case 'link': return 'Web Link';
            case 'file': return 'Local File';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 rounded-t-xl shrink-0">
                <h2 className="text-lg font-semibold">Learning Path Editor</h2>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Preview
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Saving...' : 'Save Path'}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white dark:bg-slate-900 rounded-b-xl">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold mb-6 flex items-baseline gap-2">
                            Create New Path:
                            <span className="text-primary">{title || 'Untitled'}</span>
                        </h1>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="course-title">
                                Path Title
                            </label>
                            <input
                                id="course-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Master Web Development"
                                className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary shadow-sm outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-8" ref={menuRef}>
                        {modules.map((module) => (
                            <section key={module.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-visible shadow-sm transition-all hover:shadow-md relative z-0">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 mr-4">
                                        <GripVertical className="text-slate-400 cursor-move" size={20} />
                                        <input
                                            type="text"
                                            value={module.title}
                                            onChange={(e) => handleUpdateModuleTitle(module.id, e.target.value)}
                                            className="bg-transparent border-none focus:ring-0 font-bold uppercase tracking-wider text-sm text-slate-700 dark:text-slate-300 w-full outline-none placeholder:text-slate-400"
                                            placeholder="MODULE NAME"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 relative">
                                        {/* Dropdown Menu Container */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveAddMenu(activeAddMenu === module.id ? null : module.id);
                                                }}
                                                className={`text-primary text-xs font-semibold flex items-center gap-1 hover:underline px-2 py-1 rounded transition-colors ${activeAddMenu === module.id ? 'bg-blue-100 dark:bg-blue-900/40' : ''}`}
                                            >
                                                <Plus size={16} /> Add Content
                                            </button>

                                            {activeAddMenu === module.id && (
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="p-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddContent(module.id, 'youtube');
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                        >
                                                            <Youtube className="text-red-500" size={16} />
                                                            YouTube Video
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddContent(module.id, 'link');
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                        >
                                                            <LinkIcon className="text-blue-500" size={16} />
                                                            Web Link
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddContent(module.id, 'file');
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                        >
                                                            <FileUp className="text-orange-500" size={16} />
                                                            Local File
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleDeleteModule(module.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                            title="Delete Module"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    {module.content.length === 0 ? (
                                        <div className="text-center text-slate-400 text-sm italic py-4">
                                            No content in this module yet
                                        </div>
                                    ) : (
                                        module.content.map((item) => (
                                            <div key={item.id} className="flex items-start gap-3 group p-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                                <div className="pt-2">
                                                    <input
                                                        className="h-4 w-4 rounded text-primary border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                                                        type="checkbox"
                                                        checked={selectedContent.has(item.id)}
                                                        onChange={() => toggleContentSelection(item.id)}
                                                    />
                                                </div>

                                                <div className="mt-1.5 text-slate-500">
                                                    {getContentIcon(item.type)}
                                                </div>

                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => handleUpdateContent(module.id, item.id, { title: e.target.value })}
                                                        placeholder="Content Title"
                                                        className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 border-none p-0 focus:ring-0 placeholder:text-slate-400"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.source}
                                                        onChange={(e) => handleUpdateContent(module.id, item.id, { source: e.target.value })}
                                                        placeholder={item.type === 'youtube' ? 'YouTube URL' : item.type === 'link' ? 'https://example.com' : 'File path'}
                                                        className="w-full bg-transparent text-xs text-slate-500 dark:text-slate-400 border-none p-0 focus:ring-0 placeholder:text-slate-300"
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteContent(module.id, item.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"
                                                    title="Remove Item"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        ))}

                        <button
                            onClick={handleAddModule}
                            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:border-primary transition-all group"
                        >
                            <PlusCircle className="group-hover:scale-110 transition-transform" size={24} />
                            <span className="font-medium">Add New Module</span>
                        </button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-4 mb-20">
                        <button
                            onClick={() => router.push('/paths')}
                            className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md text-sm font-semibold hover:bg-slate-900 dark:hover:bg-white shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'SAVING...' : 'SAVE PATH'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={confirmDialog.close}
                onConfirm={confirmDeleteModule}
                title="Delete Module"
                description="Are you sure you want to delete this module? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
            />
        </div>
    );
}

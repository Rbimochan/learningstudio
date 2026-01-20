
'use client';

import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { logoutAction } from '../../lib/auth-actions';
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Search,
    Bell,
    User as UserIcon,
    Play
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Components';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    const menuItems = [
        { label: 'Learning Paths', icon: LayoutDashboard, path: '/paths' },
        { label: 'My Courses', icon: BookOpen, path: '/paths' },
        { label: 'Course Play', icon: Play, path: '/studio' },
        { label: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleLogout = async () => {
        await logoutAction();
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md"
                    onClick={onClose}
                />
            )}

            <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#0a0f20] border-r border-slate-200 dark:border-white/5 transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center p-2.5 shadow-2xl shadow-blue-500/20 border border-white/5">
                            <Logo size={32} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight brand-text-gradient">LearningStudio</h1>
                    </div>

                    <nav className="flex-1 px-6 space-y-2 mt-8">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={`${item.path}-${item.label}`}
                                    href={item.path}
                                    onClick={() => onClose()}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all ${isActive
                                        ? 'brand-gradient text-white shadow-xl shadow-blue-500/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-slate-200 dark:border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 transition-colors font-semibold"
                        >
                            <LogOut size={22} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export const Navbar: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
    const { theme, toggleTheme } = useStore();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white/80 dark:bg-[#050a14]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSidebar}
                    className="p-3 text-slate-600 dark:text-slate-400 lg:hidden hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl"
                >
                    <Menu size={24} />
                </button>
                <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 w-80 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all border border-transparent focus-within:border-blue-500/20">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search learning path..."
                        className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl transition-colors border dark:border-white/5"
                >
                    {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                </button>
                <button className="p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl relative border dark:border-white/5">
                    <Bell size={22} />
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#050a14]"></span>
                </button>
                <div className="flex items-center gap-4 ml-4 pl-6 border-l border-slate-200 dark:border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold dark:text-white leading-none">user</p>
                        <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">Level 12</p>
                    </div>
                    <div className="w-11 h-11 brand-gradient rounded-2xl flex items-center justify-center text-white font-bold border border-white/10 shadow-lg shadow-blue-500/20">
                        U
                    </div>
                </div>
            </div>
        </header>
    );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050a14] transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="lg:ml-72">
                <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
                <main className="p-6 md:p-10 max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
